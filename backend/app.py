from typing import Annotated, List

import uvicorn
from fastapi import Depends, FastAPI, HTTPException, Response, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend import models
from backend.auth import get_current_user, router
from backend.database import SessionLocal, engine
from backend.dependencies import db_dependency as db_dependency

app = FastAPI()
app.include_router(router)

models.Base.metadata.create_all(bind=engine)

user_dependency = Annotated[dict, Depends(get_current_user)]


@app.get("/api/users/me", status_code=status.HTTP_200_OK)
async def user(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    return {"User": user}


@app.get("/api/users", status_code=status.HTTP_200_OK)
async def get_users(db: db_dependency):
    users = db.query(models.Users).all()
    return {"users": users}


@app.get("/api/health", status_code=status.HTTP_200_OK)
async def health_check():
    return {"status": "healthy"}
