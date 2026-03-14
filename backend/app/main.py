from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.posture import router as posture_router
from app.routes.notifications import router as notifications_router
from app.routes.recommendations import router as recommendations_router
from app.routes.gamification import router as gamification_router
from app.routes.corporate import router as corporate_router
from app.routes.settings import router as settings_router

app = FastAPI(title="PosturePal Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(posture_router)
app.include_router(notifications_router)
app.include_router(recommendations_router)
app.include_router(gamification_router)
app.include_router(corporate_router)
app.include_router(settings_router)


@app.get("/")
def root():
    return {"message": "PosturePal backend is running"}
