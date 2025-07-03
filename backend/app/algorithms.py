from collections import Counter
from nltk.tokenize import sent_tokenize, word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
import networkx as nx
from transformers import pipeline

# Load Hugging Face summarization model
hugging_face_summarizer = pipeline("summarization")

# Frequency-Based Summarization
def frequency_based_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using a frequency-based approach.
    """
    words = word_tokenize(text.lower())
    word_frequencies = Counter(words)
    sentences = sent_tokenize(text)
    ranked_sentences = sorted(
        sentences,
        key=lambda s: sum(word_frequencies[w] for w in word_tokenize(s.lower())),
        reverse=True,
    )
    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    return " ".join(ranked_sentences[:num_sentences])

# TF-IDF Summarization
def tfidf_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using TF-IDF.
    """
    sentences = sent_tokenize(text)
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(sentences)
    scores = tfidf_matrix.sum(axis=1).A1
    ranked_sentences = [sentences[i] for i in scores.argsort()[::-1]]
    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    return " ".join(ranked_sentences[:num_sentences])

# TextRank Summarization
def textrank_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using TextRank.
    """
    sentences = sent_tokenize(text)
    sentence_vectors = {i: word_tokenize(sent.lower()) for i, sent in enumerate(sentences)}
    graph = nx.Graph()
    for i, sent1 in sentence_vectors.items():
        for j, sent2 in sentence_vectors.items():
            if i != j:
                graph.add_edge(i, j, weight=len(set(sent1) & set(sent2)))
    ranked_sentences = sorted(graph.nodes, key=lambda n: nx.pagerank(graph)[n], reverse=True)
    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    return " ".join([sentences[i] for i in ranked_sentences[:num_sentences]])

# Position-Based Summarization
def position_based_summarization(text: str, compression_ratio: int) -> str:
    """
    Summarize text using a position-based approach (first few sentences).
    """
    sentences = sent_tokenize(text)
    num_sentences = max(1, len(sentences) * compression_ratio // 100)
    return " ".join(sentences[:num_sentences])

# Hugging Face Summarization
def hugging_face_summarization(text: str, summary_length: str) -> str:
    """
    Summarize text using Hugging Face's pre-trained models.
    """
    max_length = {"Short": 50, "Medium": 100, "Long": 200}.get(summary_length, 100)
    summary = hugging_face_summarizer(text, max_length=max_length, min_length=30, do_sample=False)
    return summary[0]["summary_text"]