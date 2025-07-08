# NLP Text Summarizer

A modern web application for text summarization using various Natural Language Processing algorithms. The application consists of a **FastAPI backend** and a **Next.js frontend**.

---

## Features

### Summarization Algorithms
- **Frequency-Based**: Uses word frequency to rank sentences.
- **TF-IDF**: Uses Term Frequency-Inverse Document Frequency scoring.
- **TextRank**: Graph-based ranking algorithm similar to PageRank.
- **Position-Based**: Selects first sentences (useful for news articles).
- **Hugging Face**: Uses pre-trained transformer models for abstractive summarization.

### Input Methods
- **Direct Text Input**: Paste text directly into the application.
- **URL Content Extraction**: Extract and summarize content from a URL.
- **Sample Text**: Use provided sample text for testing.

### Customizable Output
- **Compression Ratios**: Choose 10%, 25%, or 50% of the original text.
- **Summary Lengths**: For Hugging Face models, select Short, Medium, or Long summaries.
- **Summary History Tracking**: View previously generated summaries.

---

## Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with Python 3.8+
- **Dependencies**: NLTK, scikit-learn, NetworkX, Transformers, PyTorch
- **API Endpoints**:
  - `GET /sample-text`: Returns sample text for testing.
  - `POST /summarize-text`: Summarizes provided text.
  - `POST /summarize-url`: Extracts and summarizes content from a URL.

### Frontend (Next.js)
- **Framework**: Next.js with TypeScript.
- **Styling**: Tailwind CSS and shadcn/ui components.
- **Features**: Dark mode support, responsive design, accessibility compliance.

---

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 18+
- pip and npm

---

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2.  Create a virtual environment:

    ```bash
    python -m venv venv
    ```

3.  Activate the virtual environment:

      - **On Windows**:

        ```bash
        venv\Scripts\activate
        ```

      - **On macOS/Linux**:

        ```bash
        source venv/bin/activate
        ```

4.  Install dependencies:

    ```bash
    pip install -r requirements.txt
    ```

5.  Run the FastAPI server:

    ```bash
    uvicorn app.main:app --reload
    ```

-----

### Frontend Setup

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) in your browser.

-----

### Running Together

Ensure both the backend and frontend servers are running simultaneously. The frontend communicates with the backend via API endpoints.

-----

## Usage

### Web Interface

1.  Open your browser and go to `http://localhost:3000`.
2.  Choose your input method:
      - **Direct Text**: Paste text directly (minimum 100 characters).
      - **URL Input**: Enter a URL to extract and summarize content.
      - **Sample Text**: Use provided sample text for testing.
3.  Configure summarization options:
      - **Algorithm**: Choose from 5 available algorithms.
      - **Summary Length**: For Hugging Face model (Short/Medium/Long).
      - **Compression Ratio**: Percentage of original text to keep (10%/25%/50%).
4.  Click "Summarize" to generate the summary.
5.  View results and check the summary history.

### API Usage

#### Get Sample Text

```bash
curl -X GET "[http://127.0.0.1:8000/sample-text](http://127.0.0.1:8000/sample-text)"
```

#### Summarize Text

```bash
curl -X POST "[http://127.0.0.1:8000/summarize-text](http://127.0.0.1:8000/summarize-text)" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your text here...",
    "algorithm": "Frequency-Based",
    "summary_length": "Medium",
    "compression_ratio": 25
  }'
```

#### Summarize URL

```bash
curl -X POST "[http://127.0.0.1:8000/summarize-url](http://127.0.0.1:8000/summarize-url)" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "[https://example.com/article](https://example.com/article)",
    "algorithm": "TF-IDF",
    "summary_length": "Medium",
    "compression_ratio": 30
  }'
```

-----

## Algorithm Details

### Frequency-Based

  - Counts word frequencies in the text.
  - Ranks sentences by the sum of word frequencies.
  - **Best for**: General-purpose summarization.

### TF-IDF

  - Uses Term Frequency-Inverse Document Frequency scoring.
  - Identifies important sentences based on unique word combinations.
  - **Best for**: Documents with distinct topics.

### TextRank

  - Graph-based algorithm similar to Google's PageRank.
  - Creates a sentence similarity graph and ranks by importance.
  - **Best for**: Coherent, well-structured text.

### Position-Based

  - Selects the first ( N ) sentences from the text.
  - Assumes important information appears early.
  - **Best for**: News articles, research papers.

### Hugging Face

  - Uses pre-trained transformer models (e.g., BART, T5).
  - Generates abstractive summaries.
  - **Best for**: High-quality, natural-sounding summaries.

-----

## Testing

Run the API test suite:

```bash
cd backend
python test_api.py
```

This will test all endpoints and algorithms to ensure they're working correctly.

-----

## Performance Tips

  - Use **Position-Based** for fastest results.
  - Use **Hugging Face** for highest quality (but slower).
  - For large texts, consider using compression ratios of 10-25%.
  - URL extraction works best with article-style content.

-----

## Development

### Adding New Algorithms

1.  Add the algorithm function to `backend/app/utils.py`.
2.  Update the algorithm list in `backend/app/routes.py`.
3.  Add the algorithm option to frontend components.

### Customizing UI

  - Modify Tailwind classes in frontend components.
  - Update the color scheme in `frontend/tailwind.config.js`.
  - Add new components in `frontend/src/lib/components/`.

-----

## License

This project is open source and available under the **MIT License**.

-----

## Contributing

We welcome contributions\! Follow these steps to contribute:

1.  Fork the repository.
2.  Create a feature branch.
3.  Make your changes.
4.  Test thoroughly.
5.  Submit a pull request.

-----

## Acknowledgments

  - **NLTK**: For text processing utilities.
  - **Hugging Face**: For pre-trained transformer models.
  - **FastAPI**: For building the backend.
  - **Next.js**: For building the frontend.

-----

Feel free to open issues or discussions for questions, feature requests, or bug reports\!

