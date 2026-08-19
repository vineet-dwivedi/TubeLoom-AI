from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, HttpUrl
from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

app = FastAPI(title="TubeLoom AI")

class VideoRequest(BaseModel):
    url: HttpUrl

def extract_video_id(url: str) -> str:
    parsed_url = urlparse(url)
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        query_params = parse_qs(parsed_url.query)
        return query_params.get("v", [None])[0]
    elif parsed_url.hostname == "youtu.be":
        return parsed_url.path.lstrip("/")
    return None

# Helper Function: Language Fallback (English + Hindi) Support
def fetch_transcript_text(video_id: str) -> str:
    yt_api = YouTubeTranscriptApi()
    # English aur Hindi dono language codes list me pass karenge
    preferred_languages = ['en', 'hi', 'en-US', 'hi-IN']
    
    try:
        # 1. Preferred languages (English/Hindi) ke saath fetch karne ki koshish
        if hasattr(yt_api, "fetch"):
            fetched = yt_api.fetch(video_id, languages=preferred_languages)
            return " ".join([snippet.text if hasattr(snippet, "text") else snippet["text"] for snippet in fetched])
        
        if hasattr(YouTubeTranscriptApi, "get_transcript"):
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=preferred_languages)
            return " ".join([item["text"] for item in transcript])
    except Exception:
        # 2. Agar English/Hindi na mile, toh kisi bhi available language ki transcript pick kar lena
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            first_transcript = next(iter(transcript_list))
            fetched = first_transcript.fetch()
            return " ".join([item["text"] if isinstance(item, dict) else getattr(item, 'text', str(item)) for item in fetched])
        except Exception as inner_e:
            raise Exception(f"No captions found in any language: {str(inner_e)}")

@app.get("/")
async def root():
    return {"message": "TubeLoom AI Backend Active"}

@app.post("/api/process-video")
async def process_video(request: VideoRequest):
    video_id = extract_video_id(str(request.url))

    if not video_id:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL format")

    try:
        full_transcript = fetch_transcript_text(video_id)
        
        return {
            "status": "success",
            "video_id": video_id,
            "transcript_length": len(full_transcript),
            "transcript_preview": full_transcript[:300] + "..."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch transcript: {str(e)}")