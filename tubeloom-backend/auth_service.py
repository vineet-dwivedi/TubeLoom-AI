import os
from datetime import datetime, timezone
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from fastapi import HTTPException
from database import user_collection

# Production Client ID from .env
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")


async def verify_google_id_token(token: str) -> dict:
    """
    Verifies a Google ID token, upserts the user into MongoDB, and returns the user profile data.
    """
    if not GOOGLE_CLIENT_ID:
        raise HTTPException(
            status_code=500,
            detail="Google OAuth client ID is not configured."
        )

    try:
        user_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            GOOGLE_CLIENT_ID,
        )

        google_id = user_info.get("sub")
        email = user_info.get("email")

        if not google_id or not email:
            raise ValueError("Google token payload is missing required user information.")

        user_data = {
            "google_id": google_id,
            "email": email,
            "name": user_info.get("name"),
            "picture": user_info.get("picture"),
            "last_login": datetime.now(timezone.utc),
        }

        await user_collection.update_one(
            {"google_id": google_id},
            {"$set": user_data},
            upsert=True,
        )

        return user_data

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Invalid or expired Google Token: {str(e)}",
        )