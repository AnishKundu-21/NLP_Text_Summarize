# app/routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from app.utils import (
    summarize_text,
    extract_content_from_url,
    get_sample_text,
)

router = APIRouter()


# ---------- request-body models ---------- #
class SummarizeTextRequest(BaseModel):
    text: str
    algorithm: str
    summary_length: str
    compression_ratio: int


class SummarizeURLRequest(BaseModel):
    url: HttpUrl
    algorithm: str
    summary_length: str
    compression_ratio: int


# ---------- endpoints ---------- #
@router.post("/summarize-text")
async def summarize_text_endpoint(payload: SummarizeTextRequest):
    """
    Summarize the given text using the specified algorithm,
    summary length, and compression ratio.
    """
    if len(payload.text) < 100:
        raise HTTPException(
            status_code=400, detail="Text must be at least 100 characters long."
        )

    try:
        summary = summarize_text(
            payload.text,
            payload.algorithm,
            payload.summary_length,
            payload.compression_ratio,
        )
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize text: {e}")


@router.post("/summarize-url")
async def summarize_url_endpoint(payload: SummarizeURLRequest):
    """
    Extract content from the given URL and summarize it.
    """
    try:
        content = extract_content_from_url(str(payload.url))
        summary = summarize_text(
            content,
            payload.algorithm,
            payload.summary_length,
            payload.compression_ratio,
        )
        return {"summary": summary}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize URL: {e}")


@router.get("/sample-text")
async def sample_text_endpoint():
    """
    Return pre-loaded sample text.
    """
    try:
        return {"sample_text": get_sample_text()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sample text: {e}")