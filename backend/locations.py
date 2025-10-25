from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

from backend.models import (
    CreateLocationRequest,
    LocationInfo,
    LocationRankingRequest,
    LocationSearchRequest,
    UserRankings,
)

user_dependency = Annotated[dict, Depends(get_current_user)]
location_router = APIRouter(prefix="/locations", tags=["locations"])


@location_router.get("/all_locations", status_code=status.HTTP_200_OK)
async def get_all_locations(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    locations = db.execute(
        text(
            """
        SELECT * FROM "LocationInfo"
        """
        )
    ).fetchall()
    formatted_locations = []
    for location in locations:
        formatted_locations.append(
            {
                "id": location.id,
                "location": location.location,
                "description": location.description,
                "address": location.address,
                "google_rating": location.google_rating,
                "price_range": location.price_range,
                "outdoor": location.outdoor,
                "group_activity": location.group_activity,
                "vegetarian_options": location.vegetarian_options,
                "drinks": location.drinks,
                "food_available": location.food_available,
                "accessible": location.accessible,
                "formal_attire": location.formal_attire,
                "reservation_needed": location.reservation_needed,
                "image_url": location.image_url,
            }
        )
    return {"locations": formatted_locations}


@location_router.get("/location/{location_id}", status_code=status.HTTP_200_OK)
async def get_location(location_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    location = db.execute(
        text(
            """
        SELECT * FROM "LocationInfo" WHERE id = :location_id
        """
        ),
        {"location_id": location_id},
    ).fetchone()
    if location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    formatted_location = {
        "id": location.id,
        "location": location.location,
        "description": location.description,
        "address": location.address,
        "google_rating": location.google_rating,
        "price_range": location.price_range,
        "outdoor": location.outdoor,
        "group_activity": location.group_activity,
        "vegetarian_options": location.vegetarian_options,
        "drinks": location.drinks,
        "food_available": location.food_available,
        "accessible": location.accessible,
        "formal_attire": location.formal_attire,
        "reservation_needed": location.reservation_needed,
        "image_url": location.image_url,
    }
    return {"location": formatted_location}


@location_router.post("/add_location", status_code=status.HTTP_200_OK)
async def add_location(
    user: user_dependency, db: db_dependency, location_data: CreateLocationRequest
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    new_location = LocationInfo(
        location=location_data.location,
        description=location_data.description,
        address=location_data.address,
        google_rating=location_data.google_rating,
        price_range=location_data.price_range,
        outdoor=location_data.outdoor,
        group_activity=location_data.group_activity,
        vegetarian_options=location_data.vegetarian_options,
        drinks=location_data.drinks,
        food_available=location_data.food_available,
        accessible=location_data.accessible,
        formal_attire=location_data.formal_attire,
        reservation_needed=location_data.reservation_needed,
        image_url=location_data.image_url,
    )
    db.add(new_location)
    db.commit()
    return {"detail": "Location added successfully"}


@location_router.post("/location_search", status_code=status.HTTP_200_OK)
async def search_locations(
    query: LocationSearchRequest, user: user_dependency, db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    sql = """SELECT * FROM "LocationInfo" WHERE """
    conditions = []
    params = {}
    for field, value in query.dict().items():
        if value is not None:
            if field == "keywords":
                keyword_conditions = []
                for idx, keyword in enumerate(value):
                    key = f"keyword_{idx}"
                    keyword_conditions.append(f"keywords ILIKE :{key}")
                    params[key] = f"%{keyword}%"
                conditions.append("(" + " OR ".join(keyword_conditions) + ")")
            else:
                conditions.append(f"{field} = :{field}")
                params[field] = value
    if not conditions:
        raise HTTPException(
            status_code=400, detail="At least one search parameter must be provided"
        )
    sql += " AND ".join(conditions)
    locations = db.execute(text(sql), params).fetchall()
    formatted_locations = []
    for location in locations:
        formatted_locations.append(
            {
                "id": location.id,
                "location": location.location,
                "description": location.description,
                "address": location.address,
                "google_rating": location.google_rating,
                "price_range": location.price_range,
                "outdoor": location.outdoor,
                "group_activity": location.group_activity,
                "vegetarian_options": location.vegetarian_options,
                "drinks": location.drinks,
                "food_available": location.food_available,
                "accessible": location.accessible,
                "formal_attire": location.formal_attire,
                "reservation_needed": location.reservation_needed,
                "image_url": location.image_url,
            }
        )
    return {"locations": formatted_locations}


@location_router.post("/user_location_rank", status_code=status.HTTP_200_OK)
def rank_location(
    location_rank: LocationRankingRequest, user: user_dependency, db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])

    rank = UserRankings(
        user_id=user_id,
        location_id=location_rank.location_id,
        ranking=location_rank.ranking,
    )
    db.add(rank)
    db.commit()
    return {"detail": "Location ranking saved successfully"}


@location_router.get("/user_location_rankings", status_code=status.HTTP_200_OK)
def get_user_location_rankings(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    rankings = db.execute(
        text(
            """
        SELECT * FROM "UserRankings" WHERE user_id = :user_id
        """
        ),
        {"user_id": user_id},
    ).fetchall()
    formatted_rankings = []
    for ranking in rankings:
        formatted_rankings.append(
            {
                "id": ranking.id,
                "user_id": ranking.user_id,
                "location_id": ranking.location_id,
                "ranking": ranking.ranking,
            }
        )
    return {"rankings": formatted_rankings}


@location_router.get(
    "/get_locations_for_event/{event_id}", status_code=status.HTTP_200_OK
)
def get_locations_for_event(event_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    event_config = db.execute(
        text(
            """
        SELECT * FROM "EventConfigurations" WHERE event_id = :event_id
        """
        ),
        {"event_id": event_id},
    ).fetchone()
    if event_config is None:
        raise HTTPException(status_code=404, detail="Event not found")
    formatted_event_config = {
        "price_range": event_config.price_range,
        "outdoor": event_config.outdoor,
        "group_activity": event_config.group_activity,
        "vegetarian_options": event_config.vegetarian_options,
        "drinks": event_config.drinks,
        "food_available": event_config.food_available,
        "accessible": event_config.accessible,
        "formal_attire": event_config.formal_attire,
        "reservation_needed": event_config.reservation_needed,
    }
    where_clauses = []
    for key, value in formatted_event_config.items():
        if value is not None:
            where_clauses.append(f"{key} = {value}")
    sql = """SELECT * FROM "LocationInfo" WHERE """ + " AND ".join(where_clauses)
    locations = db.execute(text(sql), formatted_event_config).fetchall()
    if not locations:
        raise HTTPException(
            status_code=404, detail="No locations found matching event criteria"
        )
    return {"locations": locations}
