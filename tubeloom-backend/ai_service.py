import os
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel
from typing import List

#.env file loading
load_dotenv()

#Gemini Client Config
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY missing in .env field")

client = genai.Client(api_key = GEMINI_API_KEY)

#Response Schema
class VideoSummaryResponse(BaseModel):
    title_suggestion: str
    executive_summary: str
    key_topics: List[str]
    actionable_takeaway: List[str]

#AI Functionality
def genrate_summary(transcript: str) -> VideoSummaryResponse:
    prompt = f"""
    You are an expert AI notebook assistant, Analyze the following YouTube video transcript and extract structured notes, Return the output matching the requested schema.

    Transcript:
    {transcript[:12000]}
    """

    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': VideoSummaryResponse
        }
    )

    return VideoSummaryResponse.model_validate_json(response.text)