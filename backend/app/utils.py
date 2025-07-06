# backend/app/utils.py

import re
import requests
from bs4 import BeautifulSoup
from collections import Counter
from nltk.tokenize import sent_tokenize, word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import networkx as nx
from transformers import pipeline
import trafilatura
import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from typing import Dict, List

# Load models at startup
hugging_face_summarizer = pipeline("summarization")
bart_summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
t5_summarizer = pipeline("summarization", model="t5-base")
nlp = spacy.load("en_core_web_sm")
sentiment_analyzer = SentimentIntensityAnalyzer()


def get_sentiment(text: str) -> dict:
    """
    Analyzes the sentiment of the text using VADER.
    """
    scores = sentiment_analyzer.polarity_scores(text)
    # Classify sentiment based on the compound score
    if scores['compound'] >= 0.05:
        sentiment = "Positive"
    elif scores['compound'] <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    return {"label": sentiment, "score": scores['compound']}


def extract_entities(text: str) -> List[Dict[str, str]]:
    """
    Extracts named entities from the text using spaCy.
    """
    doc = nlp(text)
    entities = []
    for ent in doc.ents:
        entities.append({"text": ent.text, "label": ent.label_})
    return entities


def summarize_text(text: str, algorithm: str, summary_length: str, compression_ratio: int, recognize_entities: bool, analyze_sentiment: bool) -> dict:
    """
    Summarize the given text and optionally perform other NLP tasks.
    """
    summary = ""
    if algorithm == "Frequency-Based":
        summary = frequency_based_summarization(text, compression_ratio)
    elif algorithm == "TF-IDF":
        summary = tfidf_summarization(text, compression_ratio)
    elif algorithm == "TextRank":
        summary = textrank_summarization(text, compression_ratio)
    elif algorithm == "Position-Based":
        summary = position_based_summarization(text, compression_ratio)
    elif "Hugging Face" in algorithm:
        summary = hugging_face_summarization(text, summary_length, algorithm)
    else:
        raise ValueError("Invalid algorithm specified.")

    result = {"summary": summary}
    if recognize_entities:
        result["entities"] = extract_entities(summary)
    if analyze_sentiment:
        result["sentiment"] = get_sentiment(text)

    return result

def frequency_based_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using a frequency-based approach.
    """
    words = word_tokenize(text.lower())
    word_frequencies = Counter(words)
    sentences = sent_tokenize(text)
    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    if num_sentences >= len(sentences):
        return " ".join(sentences)
    ranked_sentences = sorted(sentences, key=lambda s: sum(word_frequencies[w] for w in word_tokenize(s.lower())), reverse=True)
    return " ".join(ranked_sentences[:num_sentences])

def tfidf_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using TF-IDF.
    """
    sentences = sent_tokenize(text)
    if len(sentences) <= 1:
        return text

    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    if num_sentences >= len(sentences):
        return " ".join(sentences)

    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sentences)
    scores = tfidf_matrix.sum(axis=1).A1
    ranked_sentences = [sentences[i] for i in scores.argsort()[::-1]]
    return " ".join(ranked_sentences[:num_sentences])

def textrank_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using TextRank.
    """
    sentences = sent_tokenize(text)
    if len(sentences) <= 1:
        return text

    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    if num_sentences >= len(sentences):
        return " ".join(sentences)

    sentence_vectors = {i: word_tokenize(sent.lower()) for i, sent in enumerate(sentences)}
    graph = nx.Graph()

    # Add all nodes first
    for i in range(len(sentences)):
        graph.add_node(i)

    # Add edges with weights
    for i, sent1 in sentence_vectors.items():
        for j, sent2 in sentence_vectors.items():
            if i != j:
                similarity = len(set(sent1) & set(sent2))
                if similarity > 0:  # Only add edge if there's similarity
                    graph.add_edge(i, j, weight=similarity)

    # Check if graph has edges for PageRank
    if graph.number_of_edges() == 0:
        # Fallback to position-based if no connections
        return " ".join(sentences[:num_sentences])

    pagerank_scores = nx.pagerank(graph)
    ranked_sentences = sorted(graph.nodes, key=lambda n: pagerank_scores[n], reverse=True)
    return " ".join([sentences[i] for i in ranked_sentences[:num_sentences]])

def position_based_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using a position-based approach (first few sentences).
    """
    sentences = sent_tokenize(text)
    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    if num_sentences >= len(sentences):
        return " ".join(sentences)
    return " ".join(sentences[:num_sentences])

def hugging_face_summarization(text: str, summary_length: str, algorithm: str) -> str:
    """
    Summarize text using Hugging Face's pre-trained models.
    """
    # Check if text is too short for summarization
    if len(text.split()) < 30:
        return text

    if summary_length == "Short":
        min_length = 30
        max_length = 80
    elif summary_length == "Long":
        min_length = 100
        max_length = 250
    else:  # Medium
        min_length = 50
        max_length = 150

    try:
        if "BART" in algorithm:
            summarizer = bart_summarizer
        elif "T5" in algorithm:
            summarizer = t5_summarizer
        else:
            summarizer = hugging_face_summarizer
            
        summary = summarizer(text, max_length=max_length, min_length=min_length, do_sample=False)
        return summary[0]["summary_text"]
    except Exception as e:
        # Fallback to first few sentences if Hugging Face fails
        sentences = sent_tokenize(text)
        num_sentences = max(1, min(3, len(sentences)))
        return " ".join(sentences[:num_sentences])

# URL Content Extraction
def extract_content_from_url(url: str) -> str:
    """
    Extract main content from the given URL using trafilatura.
    """
    try:
        downloaded = trafilatura.fetch_url(url)
        if downloaded is None:
            raise ValueError("Failed to download the URL content.")

        content = trafilatura.extract(downloaded, include_comments=False, include_tables=False)

        if not content:
            raise ValueError("No readable content found on the webpage using trafilatura.")

        return content
    except Exception as e:
        # Fallback or detailed error
        raise ValueError(f"Failed to extract content: {str(e)}")


# Sample Text Retrieval
def get_sample_text() -> str:
    """
    Return pre-loaded sample text for testing.
    """
    return (
        "Natural language processing (NLP) is a subfield of linguistics, computer science, "
        "and artificial intelligence concerned with the interactions between computers and human language, "
        "in particular how to program computers to process and analyze large amounts of natural language data."
    )