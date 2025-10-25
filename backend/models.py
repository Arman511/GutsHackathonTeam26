from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from backend.database import Base


class Users(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)


class CreateUserRequest(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
