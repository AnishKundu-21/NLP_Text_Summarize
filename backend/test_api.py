#!/usr/bin/env python3

"""
Simple test script to verify all summarization algorithms work correctly.
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_sample_text():
    """Test the sample text endpoint"""
    print("Testing sample text endpoint...")
    response = requests.get(f"{BASE_URL}/sample-text")
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Sample text retrieved: {data['sample_text'][:50]}...")
        return data['sample_text']
    else:
        print(f"✗ Sample text failed: {response.status_code}")
        return None

def test_summarization(text, algorithm):
    """Test a specific summarization algorithm"""
    print(f"Testing {algorithm} algorithm...")
    
    payload = {
        "text": text,
        "algorithm": algorithm,
        "summary_length": "Medium",
        "compression_ratio": 30
    }
    
    response = requests.post(f"{BASE_URL}/summarize-text", json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"✓ {algorithm} worked: {data['summary'][:50]}...")
        return True
    else:
        print(f"✗ {algorithm} failed: {response.status_code} - {response.text}")
        return False

def test_url_summarization():
    """Test URL summarization"""
    print("Testing URL summarization...")
    
    payload = {
        "url": "https://en.wikipedia.org/wiki/Natural_language_processing",
        "algorithm": "Frequency-Based",
        "summary_length": "Medium",
        "compression_ratio": 25
    }
    
    response = requests.post(f"{BASE_URL}/summarize-url", json=payload)
    if response.status_code == 200:
        data = response.json()
        print(f"✓ URL summarization worked: {data['summary'][:50]}...")
        return True
    else:
        print(f"✗ URL summarization failed: {response.status_code} - {response.text}")
        return False

def main():
    """Run all tests"""
    print("=== Testing NLP Text Summarizer API ===\n")
    
    # Test sample text
    sample_text = test_sample_text()
    if not sample_text:
        print("Cannot proceed without sample text")
        return
    
    print()
    
    # Test all algorithms
    algorithms = [
        "Frequency-Based",
        "TF-IDF", 
        "TextRank",
        "Position-Based",
        "Hugging Face"
    ]
    
    # Use a longer sample for testing
    long_text = """
    Natural language processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language, in particular how to program computers to process and analyze large amounts of natural language data. The goal is a computer capable of understanding the contents of documents, including the contextual nuances of the language within them. The technology can then accurately extract information and insights contained in the documents as well as categorize and organize the documents themselves.

    NLP draws from many disciplines, including computer science and computational linguistics, in its pursuit to fill the gap between human communication and computer understanding. NLP is used in many applications, including machine translation, sentiment analysis, information extraction, question answering, and automatic summarization. The field has seen rapid growth in recent years, driven by advances in machine learning and deep learning techniques.
    """
    
    results = {}
    for algorithm in algorithms:
        results[algorithm] = test_summarization(long_text, algorithm)
        print()
    
    # Test URL summarization
    results["URL"] = test_url_summarization()
    print()
    
    # Summary
    print("=== Test Results ===")
    for test_name, result in results.items():
        status = "✓ PASSED" if result else "✗ FAILED"
        print(f"{test_name}: {status}")
    
    passed = sum(results.values())
    total = len(results)
    print(f"\nOverall: {passed}/{total} tests passed")

if __name__ == "__main__":
    main()
