from fastapi import FastAPI
from app.api.routes import user

app = FastAPI(title="FastAPI Example")

# 라우트 등록
app.include_router(user.router, prefix="/users", tags=["users"])