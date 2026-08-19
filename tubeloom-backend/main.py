from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

from youtube_service import extract_video_id, fetch_transcript_text
from ai_service import (
    generate_summary, 
    VideoSummaryResponse, 
    ask_question_about_video, 
    ChatResponse
)

app = FastAPI(title="TubeLoom AI")

# Allowed origins for local React dev servers
origins = [
    "http://localhost:3000",   # Next.js / CRA
    "http://localhost:5173",   # Vite React
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
]

# CORS Middleware Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Production me exact frontend domain daalein ya testing me ["*"]
    allow_credentials=True,
    allow_methods=["*"],         # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],         # Content-Type, Authorization, etc.
)


class VideoRequest(BaseModel):
    url: HttpUrl


class ChatRequest(BaseModel):
    url: HttpUrl
    question: str


@app.get("/")
async def root():
    return {"message": "TubeLoom AI Backend Active"}


@app.post("/api/process-video", response_model=VideoSummaryResponse)
async def process_video(request: VideoRequest):
    video_id = extract_video_id(str(request.url))

    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    try:
        full_transcript = fetch_transcript_text(video_id)
        summary_result = generate_summary(full_transcript)
        return summary_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")


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