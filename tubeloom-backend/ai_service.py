import os
from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel
from typing import List

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY missing in .env file!")

client = genai.Client(api_key=GEMINI_API_KEY)


# 1. SCHEMAS Video Summarization Response
class VideoSummaryResponse(BaseModel):
    title_suggestion: str
    executive_summary: str
    key_topics: List[str]
    actionable_takeaways: List[str]

class ChatResponse(BaseModel):
    answer: str

# 2. FUNCTIONS Summary Generation
def generate_summary(transcript: str) -> VideoSummaryResponse:
    prompt = f"""
    You are an expert AI notebook assistant. Analyze the following YouTube video transcript 
    and extract structured notes. Return the output matching the requested schema.

    Transcript:
    {transcript[:12000]}
    """
    
    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=prompt,
        config={
            'response_mime_type': 'application/json',
            'response_schema': VideoSummaryResponse,
        },
    )
    
    return VideoSummaryResponse.model_validate_json(response.text)

# 3. FUNCTION ques & ans
def ask_question_about_video(transcript: str, question: str) -> ChatResponse:
    prompt = f"""
    You are an expert video assistant. Answer the user's question strictly based on the video transcript provided below.
    If the answer cannot be found in the transcript, state clearly: "This information is not mentioned in the video."

    Transcript:
    {transcript[:12000]}

    User Question: {question}
    """
    
    response = client.models.generate_content(
        model='gemini-3.6-flash',
        contents=prompt,
    )
    
    answer_text = response.text.strip() if response.text else "No response generated."
    
    return ChatResponse(answer=answer_text)