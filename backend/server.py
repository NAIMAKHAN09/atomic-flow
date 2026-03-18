from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Cookie
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import requests

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Models
class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: str

class SessionData(BaseModel):
    session_id: str

class Habit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    habit_id: str
    user_id: str
    name: str
    description: Optional[str] = None
    category: str
    cue: Optional[str] = None
    craving: Optional[str] = None
    response: Optional[str] = None
    reward: Optional[str] = None
    color: str = "#2E4033"
    icon: Optional[str] = None
    goal_frequency: int = 1
    created_at: str

class HabitCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    cue: Optional[str] = None
    craving: Optional[str] = None
    response: Optional[str] = None
    reward: Optional[str] = None
    color: str = "#2E4033"
    icon: Optional[str] = None
    goal_frequency: int = 1

class HabitUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    cue: Optional[str] = None
    craving: Optional[str] = None
    response: Optional[str] = None
    reward: Optional[str] = None
    color: Optional[str] = None
    icon: Optional[str] = None
    goal_frequency: Optional[int] = None

class HabitLog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    log_id: str
    habit_id: str
    user_id: str
    completed_at: str
    notes: Optional[str] = None

class HabitLogCreate(BaseModel):
    notes: Optional[str] = None

class AnalyticsOverview(BaseModel):
    total_habits: int
    completed_today: int
    current_streak: int
    total_completions: int

# Auth Helper
async def get_current_user(request: Request) -> str:
    session_token = request.cookies.get("session_token")
    if not session_token:
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            session_token = auth_header.split(" ")[1]
    
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    session_doc = await db.user_sessions.find_one(
        {"session_token": session_token},
        {"_id": 0}
    )
    
    if not session_doc:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    expires_at = session_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    
    return session_doc["user_id"]

# Auth Routes
@api_router.post("/auth/session")
async def create_session(session_data: SessionData, response: Response):
    try:
        headers = {"X-Session-ID": session_data.session_id}
        resp = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers=headers,
            timeout=10
        )
        
        if resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Invalid session ID")
        
        data = resp.json()
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        
        existing_user = await db.users.find_one(
            {"email": data["email"]},
            {"_id": 0}
        )
        
        if existing_user:
            user_id = existing_user["user_id"]
            await db.users.update_one(
                {"user_id": user_id},
                {"$set": {
                    "name": data["name"],
                    "picture": data.get("picture")
                }}
            )
        else:
            await db.users.insert_one({
                "user_id": user_id,
                "email": data["email"],
                "name": data["name"],
                "picture": data.get("picture"),
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        
        session_token = data["session_token"]
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        
        await db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at,
            "created_at": datetime.now(timezone.utc)
        })
        
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            path="/",
            max_age=7*24*60*60
        )
        
        user = await db.users.find_one({"user_id": user_id}, {"_id": 0})
        return User(**user)
        
    except requests.RequestException as e:
        logger.error(f"Error calling auth service: {e}")
        raise HTTPException(status_code=500, detail="Authentication failed")

@api_router.get("/auth/me", response_model=User)
async def get_me(request: Request):
    user_id = await get_current_user(request)
    user_doc = await db.users.find_one({"user_id": user_id}, {"_id": 0})
    
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Handle datetime conversion for created_at field
    if isinstance(user_doc.get('created_at'), datetime):
        user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    return User(**user_doc)

@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    session_token = request.cookies.get("session_token")
    if session_token:
        await db.user_sessions.delete_one({"session_token": session_token})
    
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}

# Habits Routes
@api_router.post("/habits", response_model=Habit)
async def create_habit(habit_data: HabitCreate, request: Request):
    user_id = await get_current_user(request)
    
    habit_id = f"habit_{uuid.uuid4().hex[:12]}"
    habit = Habit(
        habit_id=habit_id,
        user_id=user_id,
        created_at=datetime.now(timezone.utc).isoformat(),
        **habit_data.model_dump()
    )
    
    await db.habits.insert_one(habit.model_dump())
    return habit

@api_router.get("/habits", response_model=List[Habit])
async def get_habits(request: Request):
    user_id = await get_current_user(request)
    habits = await db.habits.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    return [Habit(**h) for h in habits]

@api_router.get("/habits/{habit_id}", response_model=Habit)
async def get_habit(habit_id: str, request: Request):
    user_id = await get_current_user(request)
    habit = await db.habits.find_one(
        {"habit_id": habit_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    return Habit(**habit)

@api_router.put("/habits/{habit_id}", response_model=Habit)
async def update_habit(habit_id: str, habit_update: HabitUpdate, request: Request):
    user_id = await get_current_user(request)
    
    update_data = {k: v for k, v in habit_update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    result = await db.habits.update_one(
        {"habit_id": habit_id, "user_id": user_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    habit = await db.habits.find_one(
        {"habit_id": habit_id, "user_id": user_id},
        {"_id": 0}
    )
    return Habit(**habit)

@api_router.delete("/habits/{habit_id}")
async def delete_habit(habit_id: str, request: Request):
    user_id = await get_current_user(request)
    
    result = await db.habits.delete_one({"habit_id": habit_id, "user_id": user_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    await db.habit_logs.delete_many({"habit_id": habit_id})
    
    return {"message": "Habit deleted successfully"}

# Habit Logs Routes
@api_router.post("/habits/{habit_id}/log", response_model=HabitLog)
async def log_habit(habit_id: str, log_data: HabitLogCreate, request: Request):
    user_id = await get_current_user(request)
    
    habit = await db.habits.find_one(
        {"habit_id": habit_id, "user_id": user_id},
        {"_id": 0}
    )
    
    if not habit:
        raise HTTPException(status_code=404, detail="Habit not found")
    
    log_id = f"log_{uuid.uuid4().hex[:12]}"
    log = HabitLog(
        log_id=log_id,
        habit_id=habit_id,
        user_id=user_id,
        completed_at=datetime.now(timezone.utc).isoformat(),
        notes=log_data.notes
    )
    
    await db.habit_logs.insert_one(log.model_dump())
    return log

@api_router.get("/habits/{habit_id}/logs", response_model=List[HabitLog])
async def get_habit_logs(habit_id: str, request: Request):
    user_id = await get_current_user(request)
    
    logs = await db.habit_logs.find(
        {"habit_id": habit_id, "user_id": user_id},
        {"_id": 0}
    ).sort("completed_at", -1).to_list(1000)
    
    return [HabitLog(**log) for log in logs]

@api_router.delete("/habits/{habit_id}/logs/{log_id}")
async def delete_habit_log(habit_id: str, log_id: str, request: Request):
    user_id = await get_current_user(request)
    
    result = await db.habit_logs.delete_one({
        "log_id": log_id,
        "habit_id": habit_id,
        "user_id": user_id
    })
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Log not found")
    
    return {"message": "Log deleted successfully"}

# Analytics Routes
@api_router.get("/analytics/overview", response_model=AnalyticsOverview)
async def get_analytics_overview(request: Request):
    user_id = await get_current_user(request)
    
    total_habits = await db.habits.count_documents({"user_id": user_id})
    
    today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    today_logs = await db.habit_logs.find({
        "user_id": user_id,
        "completed_at": {"$gte": today_start.isoformat()}
    }, {"_id": 0}).to_list(1000)
    
    completed_today = len(set(log["habit_id"] for log in today_logs))
    
    all_logs = await db.habit_logs.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("completed_at", -1).to_list(10000)
    
    current_streak = 0
    if all_logs:
        dates_with_logs = set()
        for log in all_logs:
            log_date = datetime.fromisoformat(log["completed_at"]).date()
            dates_with_logs.add(log_date)
        
        sorted_dates = sorted(dates_with_logs, reverse=True)
        today = datetime.now(timezone.utc).date()
        
        if sorted_dates and (sorted_dates[0] == today or sorted_dates[0] == today - timedelta(days=1)):
            current_streak = 1
            for i in range(1, len(sorted_dates)):
                if sorted_dates[i] == sorted_dates[i-1] - timedelta(days=1):
                    current_streak += 1
                else:
                    break
    
    total_completions = len(all_logs)
    
    return AnalyticsOverview(
        total_habits=total_habits,
        completed_today=completed_today,
        current_streak=current_streak,
        total_completions=total_completions
    )

@api_router.get("/analytics/streaks")
async def get_streaks(request: Request):
    user_id = await get_current_user(request)
    
    habits = await db.habits.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    
    # Optimized: Fetch all logs for this user in a single query instead of N queries
    all_logs = await db.habit_logs.find(
        {"user_id": user_id},
        {"_id": 0}
    ).sort("completed_at", -1).to_list(10000)
    
    # Group logs by habit_id in memory
    logs_by_habit = {}
    for log in all_logs:
        habit_id = log["habit_id"]
        if habit_id not in logs_by_habit:
            logs_by_habit[habit_id] = []
        logs_by_habit[habit_id].append(log)
    
    streaks = []
    today = datetime.now(timezone.utc).date()
    
    for habit in habits:
        habit_id = habit["habit_id"]
        logs = logs_by_habit.get(habit_id, [])
        
        if not logs:
            streaks.append({
                "habit_id": habit_id,
                "habit_name": habit["name"],
                "current_streak": 0,
                "total_completions": 0
            })
            continue
        
        dates_with_logs = set()
        for log in logs:
            log_date = datetime.fromisoformat(log["completed_at"]).date()
            dates_with_logs.add(log_date)
        
        sorted_dates = sorted(dates_with_logs, reverse=True)
        
        current_streak = 0
        if sorted_dates[0] == today or sorted_dates[0] == today - timedelta(days=1):
            current_streak = 1
            for i in range(1, len(sorted_dates)):
                if sorted_dates[i] == sorted_dates[i-1] - timedelta(days=1):
                    current_streak += 1
                else:
                    break
        
        streaks.append({
            "habit_id": habit_id,
            "habit_name": habit["name"],
            "current_streak": current_streak,
            "total_completions": len(logs)
        })
    
    return streaks

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()