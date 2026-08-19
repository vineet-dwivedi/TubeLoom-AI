from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from fastapi.middleware.cors import CORSMiddleware

# Services
from ai_service import generate_summary, VideoSummaryResponse
from youtube_service import extract_video_id, fetch_transcript_text

# FastAPI Integration
app = FastAPI(title="TubeLoom AI")

# Allowed origins
origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
}

# CORS Middleware Config
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"], # Content-Type, Authorization, etc
)

class VideoRequest(BaseModel):
    url: HttpUrl

@app.get("/")
async def root():
    return {"message": "TubeLoom AI Backend Active"}

@app.post("/api/process-video", response_model=VideoSummaryResponse)
async def process_video(request: VideoRequest):
    video_id = extract_video_id(str(request.url))

    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    try:
        #Fetch transcript from YouTube service
        full_transcript = fetch_transcript_text(video_id)

        #Genrate summary from AI service
        summary_result = generate_summary(full_transcript)

        return summary_result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")