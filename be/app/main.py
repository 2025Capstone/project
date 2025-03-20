from fastapi import FastAPI
from app.api.routes import student
from app.api.routes import video

app = FastAPI(title="FastAPI Example")

# 라우트 등록
app.include_router(student.router, prefix="/students", tags=["students"])
app.include_router(video.router, prefix="/videos", tags=["videos"])