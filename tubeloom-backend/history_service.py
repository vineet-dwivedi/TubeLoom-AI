from datetime import datetime, timezone
from database import history_collection

async def save_video_history(google_id: str, video_url: str, video_id: str, summary: dict):
    history_item = {
        "google_id": google_id,
        "video_url": video_url,
        "video_id": video_id,
        "title": summary.get("title_suggestion", "Untitled Video"),
        "executive_summary": summary.get("executive_summary"),
        "created_at": datetime.now(timezone.utc),
    }
    await history_collection.insert_one(history_item)

async def get_user_history(google_id: str, limit: int = 10):
    cursor = history_collection.find({"google_id": google_id}.sort("created_at", -1).limit(limit))
    history = []
    async for doc in cursor:
        doc["_id"] = str(doc["_id"])
        history.append(doc)
    return history