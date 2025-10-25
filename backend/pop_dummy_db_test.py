from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

user_dependency = Annotated[dict, Depends(get_current_user)]
populate_router = APIRouter(prefix="/populate", tags=["populate"])

@populate_router.post("/populate_db", status_code=status.HTTP_200_OK)
async def populate_db(user: user_dependency, db: db_dependency):
    sample_keywords = ["park", "outdoor", "nature", "walking", "picnic"]
    # for kw in sample_keywords:
    #     db.execute(
    #         text("""
    #         INSERT INTO "Keywords" (keyword)
    #         VALUES (:keyword)
    #         """),
    #         {"keyword": kw}
    #     )
    # db.commit()

    sammple_location = {
        "location": "Central Park",
        "description": "A large public park in New York City.",
        "address": "New York, NY 10022",
        "google_rating": 5,
        "price_range": "$$",
        "outdoor": True,
        "group_activity": True,
        "vegetarian": True,
        "drinks": True,
        "food_available": True,
        "accessible": True,
        "formal_attire": False,
        "reservation_needed": False,
        "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg/330px-Global_Citizen_Festival_Central_Park_New_York_City_from_NYonAir_%2815351915006%29.jpg"
    }

    sample_location_keywords = [
        {"location_id": 1, "keyword_id": 1},
        {"location_id": 1, "keyword_id": 2},
        {"location_id": 1, "keyword_id": 3},
        {"location_id": 1, "keyword_id": 4},
        {"location_id": 1, "keyword_id": 5},
    ]

    # for loc_kw in sample_location_keywords:
    #     db.execute(
    #         text("""
    #         INSERT INTO "LocationKeywords" (location_id, keyword_id)
    #         VALUES (:location_id, :keyword_id)
    #         """),
    #         loc_kw
    #     )
    # db.commit()
    # db.execute(
    #     text("""
    #     INSERT INTO "LocationInfo" (location, description, address, google_rating, price_range, outdoor, group_activity, vegetarian, drinks, food_available, accessible, formal_attire, reservation_needed)
    #     VALUES (:location, :description, :address, :google_rating, :price_range, :outdoor, :group_activity, :vegetarian, :drinks, :food_available, :accessible, :formal_attire, :reservation_needed)
    #     """),
    #     sammple_location
    # )
    # db.commit()

    # sample_event = {
    #     "event_name": "Christmas Dinner",
    #     "event_date": "2024-12-31",
    #     "location": 1,
    #     "user_id": 1,
    #     "description": "This is WCRT's annual Christmas dinner event.",
    # }
    # db.execute(
    #     text("""
    #     INSERT INTO "EventsInfo" (event_name, event_date, user_id, location, description)
    #     VALUES (:event_name, :event_date, :user_id, :location, :description)
    #     """),
    #     sample_event
    # )
    # db.commit()

    sample_event_users = {
        "event_id": 1,
        "user_id": 2,
    }
    # db.execute(
    #     text("""
    #     INSERT INTO "EventUsers" (event_id, user_id)
    #     VALUES (:event_id, :user_id)
    #     """),
    #     sample_event_users
    # )
    # db.commit()

    sample_user_review = [{
        "location_id": 1,
        "user_review": "Great place to relax and enjoy nature!",
        "user_rating": 5,
    },
    {
        "location_id": 1,
        "user_review": "Beautiful scenery and lots of activities.",
        "user_rating": 4,
    },
    {
        "location_id": 1,
        "user_review": "A must-visit spot in NYC.",
        "user_rating": 5,
    }]

    # for review in sample_user_review:
    #     db.execute(
    #         text("""
    #         INSERT INTO "ReviewData" (location_id, user_review, user_rating)
    #         VALUES (:location_id, :user_review, :user_rating)
    #         """),
    #         review
    #     )
    # db.commit()

    sample_user_rankings = [{
        "user_id": 2,
        "location_id": 1,
        "ranking_score": 4,
    },
    {
        "user_id": 1,
        "location_id": 1,
        "ranking_score": 5,
    }]

    # for ranking in sample_user_rankings:
    #     db.execute(
    #         text("""
    #         INSERT INTO "UserRankings" (user_id, location_id, ranking)
    #         VALUES (:user_id, :location_id, :ranking_score)
    #         """),
    #         ranking
    #     )
    # db.commit()


    return {"message": "Database populated with initial event data"}
