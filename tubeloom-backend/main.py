from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from ai_service import genrate_summary, VideoSummaryResponse
from youtube_service import extract_video_id, fetch_transcript_text

app = FastAPI(title="TubeLoom AI")

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
        summary_result = genrate_summary(full_transcript)
        
        return summary_result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process video: {str(e)}")