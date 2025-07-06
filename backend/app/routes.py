# app/routes.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from typing import Optional

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
    recognize_entities: Optional[bool] = False


class SummarizeURLRequest(BaseModel):
    url: HttpUrl
    algorithm: str
    summary_length: str
    compression_ratio: int
    recognize_entities: Optional[bool] = False


# ---------- endpoints ---------- #
@router.post("/summarize-text")
async def summarize_text_endpoint(payload: SummarizeTextRequest):
    """
    Summarize the given text and optionally recognize entities.
    """
    if len(payload.text) < 100:
        raise HTTPException(
            status_code=400, detail="Text must be at least 100 characters long."
        )

    try:
        result = summarize_text(
            payload.text,
            payload.algorithm,
            payload.summary_length,
            payload.compression_ratio,
            payload.recognize_entities,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to summarize text: {e}")


@router.post("/summarize-url")
async def summarize_url_endpoint(payload: SummarizeURLRequest):
    """
    Extract content from a URL, summarize it, and optionally recognize entities.
    """
    try:
        content = extract_content_from_url(str(payload.url))
        result = summarize_text(
            content,
            payload.algorithm,
            payload.summary_length,
            payload.compression_ratio,
            payload.recognize_entities,
        )
        return result
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