from youtube_transcript_api import YouTubeTranscriptApi
from urllib.parse import urlparse, parse_qs

def extract_video_id(url: str) -> str:
    """YouTube URL Extraction."""
    parsed_url = urlparse(url)
    if parsed_url.hostname in ["www.youtube.com", "youtube.com"]:
        query_params = parse_qs(parsed_url.query)
        return query_params.get("v", [None])[0]
    elif parsed_url.hostname == "youtu.be":
        return parsed_url.path.lstrip("/")
    return None


def fetch_transcript_text(video_id: str) -> str:
    """Transcript fetch by using Video ID"""
    yt_api = YouTubeTranscriptApi()
    preferred_languages = ['en', 'hi', 'en-US', 'hi-IN']
    
    try:
        # v1.x support
        if hasattr(yt_api, "fetch"):
            fetched = yt_api.fetch(video_id, languages=preferred_languages)
            return " ".join([snippet.text if hasattr(snippet, "text") else snippet["text"] for snippet in fetched])
        
        # v0.x support
        if hasattr(YouTubeTranscriptApi, "get_transcript"):
            transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=preferred_languages)
            return " ".join([item["text"] for item in transcript])
    except Exception:
        # Any language fallback
        try:
            transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
            first_transcript = next(iter(transcript_list))
            fetched = first_transcript.fetch()
            return " ".join([item["text"] if isinstance(item, dict) else getattr(item, 'text', str(item)) for item in fetched])
        except Exception as inner_e:
            raise Exception(f"No captions found in any language: {str(inner_e)}")