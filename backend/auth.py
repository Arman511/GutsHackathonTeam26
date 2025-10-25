from datetime import datetime, timedelta
import os
from typing import Annotated
import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy.util import deprecated
from starlette import status

from backend.database import SessionLocal
from backend.dependencies import db_dependency
from backend.models import CreateUserRequest, Token, Users

auth_router = APIRouter(prefix="/auth", tags=["auth"])
SECRET_KEY = os.getenv(
    "SECRET_KEY", "0a2bc0e6d35762554bcad140ecd1cec7c2a9fb1b5252da1d2c0b4e10e6c20f6f"
)
ALGORITHM = "HS256"

oauth2_bearer = OAuth2PasswordBearer(tokenUrl="api/auth/token")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@auth_router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    """
    Creates a new user with a hashed password and stores it in the database.
    """
    if (
        not create_user_request.name
        or not create_user_request.username
        or not create_user_request.password
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Name, username, and password are required",
        )
    existing_user = (
        db.query(Users).filter(Users.username == create_user_request.username).first()
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    create_user_model = Users(
        name=create_user_request.name,
        username=create_user_request.username,
        hashed_password=bcrypt.hashpw(
            create_user_request.password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8"),
    )
    db.add(create_user_model)
    db.commit()
    return {"message": "User created successfully"}


def authenticate_user(username: str, password: str, db):
    """
    Verifies the username and password against stored hashed password.
    Returns the user if authentication is successful, otherwise returns False.
    """
    user = db.query(Users).filter(Users.username == username).first()
    if not user:
        return False
    if not bcrypt.checkpw(
        password.encode("utf-8"), user.hashed_password.encode("utf-8")
    ):
        return False
    return user


def create_access_token(username: str, user_id: int, expires_delta: timedelta):
    """
    Generates a JWT access token with an expiration time.
    """
    encode = {"sub": username, "id": user_id}
    expires = datetime.now() + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: Annotated[str, Depends(oauth2_bearer)]):
    """
    Decodes the JWT token and retrieves user details.
    Raises an exception if the token is invalid or expired.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = str(payload.get("sub"))
        user_id: str = str(payload.get("id"))
        if username is None or user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate user",
            )

        return {"username": username, "id": user_id}

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user"
        )


@auth_router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db: db_dependency
):
    """
    Authenticates user credentials and returns a JWT token if valid.
    """
    user = authenticate_user(form_data.username, form_data.password, db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate User"
        )
    username = str(user.username)
    user_id = user.id
    token = create_access_token(
        username, user_id, timedelta(minutes=20)  # pyright: ignore[reportArgumentType]
    )

    return {"access_token": token, "token_type": "bearer"}
