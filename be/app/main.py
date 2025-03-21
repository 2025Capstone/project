from fastapi import FastAPI
from app.api.routes import student
from app.api.routes import video
from app.api.routes import websocket
app = FastAPI(title="FastAPI Example")

# 라우트 등록
app.include_router(student.router, prefix="/students", tags=["students"])
app.include_router(video.router, prefix="/videos", tags=["videos"])

app.include_router(websocket.router, prefix="/ws", tags=["websocket"])