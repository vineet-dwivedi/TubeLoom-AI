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

#