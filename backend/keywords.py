from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

from backend.models import CreateKeywordRequest

user_dependency = Annotated[dict, Depends(get_current_user)]
keyword_router = APIRouter(prefix="/keywords", tags=["keywords"])


@keyword_router.get("/all_keywords", status_code=status.HTTP_200_OK)
async def get_all_keywords(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    keywords = db.execute(
        text(
            """
        SELECT * FROM "Keywords"
        """
        )
    ).fetchall()
    formatted_keywords = []
    for keyword in keywords:
        formatted_keywords.append(
            {
                "id": keyword.id,
                "keyword": keyword.keyword,
            }
        )
    return {"keywords": formatted_keywords}


@keyword_router.get("/keyword/{keyword_id}", status_code=status.HTTP_200_OK)
async def get_keyword(keyword_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    keyword = db.execute(
        text(
            """
        SELECT * FROM "Keywords" WHERE "id" = :keyword_id
        """
        ),
        {"keyword_id": keyword_id},
    ).fetchone()
    if not keyword:
        raise HTTPException(status_code=404, detail="Keyword not found")
    return {
        "id": keyword.id,
        "keyword": keyword.keyword,
    }


@keyword_router.post("/create_keyword", status_code=status.HTTP_201_CREATED)
async def create_keyword(
    keyword: CreateKeywordRequest, user: user_dependency, db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    if not keyword.keyword:
        raise HTTPException(status_code=400, detail="Keyword cannot be empty")
    if len(keyword.keyword) > 100:
        raise HTTPException(
            status_code=400, detail="Keyword length exceeds maximum limit of 100"
        )
    if keyword.keyword.strip() == "":
        raise HTTPException(
            status_code=400, detail="Keyword cannot be empty or whitespace"
        )
    check_existing = db.execute(
        text(
            """
        SELECT * FROM "Keywords" WHERE "keyword" = :keyword
        """
        ),
        {"keyword": keyword.keyword},
    ).fetchone()
    if check_existing:
        raise HTTPException(status_code=400, detail="Keyword already in system")

    db.execute(
        text(
            """
        INSERT INTO "Keywords" ("keyword") VALUES (:keyword)
        """
        ),
        {"keyword": keyword.keyword},
    )
    db.commit()
    return {"message": "Keyword created successfully"}
