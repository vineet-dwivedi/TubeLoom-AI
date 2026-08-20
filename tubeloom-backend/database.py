import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URI = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(MONGO_URI)

# Database & Collections
db = client.tubeloom_db
user_collection = db.user 
history_collection = db.history