from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from auth_service import verify_google_id_token
from history_service import save_video_history, get_user_history
from youtube_service import extract_video_id, fetch_transcript_text
from ai_service import (
    generate_summary, 
    VideoSummaryResponse, 
    ask_question_about_video, 
    ChatResponse
)

app = FastAPI(title="TubeLoom AI")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1. Models Update
class GoogleAuthRequest(BaseModel):
    credential: str

class VideoRequest(BaseModel):
    url: HttpUrl
    google_id: Optional[str] = None  # <-- Added Optional google_id

class ChatRequest(BaseModel):
    url: HttpUrl
    question: str


# 2. Authentication Endpoint
@app.post("/api/auth/google")
async def google_auth(request: GoogleAuthRequest):
    return await verify_google_id_token(request.credential)  # <-- Added await


@app.get("/")
async def root():
    return {"message": "TubeLoom AI Backend Active"}


# 3. Video Processing & History Save Endpoint
@app.post("/api/process-video", response_model=VideoSummaryResponse)
async def process_video(request: VideoRequest):
    video_id = extract_video_id(str(request.url))

    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    try:
        full_transcript = fetch_transcript_text(video_id)
        summary_result = generate_summary(full_transcript)

        # History Save Logic
        if request.google_id:
            summary_data = summary_result.model_dump() if hasattr(summary_result, 'model_dump') else summary_result.dict()
            await save_video_history(
                google_id=request.google_id,
                video_url=str(request.url),
                video_id=video_id,
                summary=summary_data
            )

        return summary_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")


# 4. Fetch History Endpoint
@app.get("/api/history/{google_id}")
async def fetch_history(google_id: str):
    return await get_user_history(google_id)


# 5. Interactive Chat Endpoint
@app.post("/api/chat", response_model=ChatResponse)
async def video_chat(request: ChatRequest):
    video_id = extract_video_id(str(request.url))

    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    try:
        full_transcript = fetch_transcript_text(video_id)
        answer = ask_question_about_video(full_transcript, request.question)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get answer: {str(e)}")