from pydantic import BaseModel
from sqlalchemy import Column, Integer, String
from backend.database import Base


class Users(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String, unique=True)
    hashed_password = Column(String)


class CreateUserRequest(BaseModel):
    name: str
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
