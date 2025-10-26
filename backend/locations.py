from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

from backend.models import (
    AddReviewRequest,
    CreateLocationRequest,
    LocationInfo,
    LocationRankingRequest,
    LocationSearchRequest,
    ReviewData,
    UserRankings,
)

user_dependency = Annotated[dict, Depends(get_current_user)]
location_router = APIRouter(prefix="/locations", tags=["locations"])


def build_location_filters(filters: dict):
    """Return (conditions_list, params) for given filter dict.

    - text fields (location, description, address) use ILIKE %%value%%
    - boolean fields: False means "no preference" (skip); True filters to True
    - open_time: location.open_time <= provided
    - close_time: location.close_time >= provided
    - google_rating: >=
    - price_range: exact match
    - keywords: list -> EXISTS subquery against LocationKeywords/Keywords (ANY match)
    """
    conditions = []
    params = {}
    for field, value in filters.items():
        if value is None:
            continue

        # if field == "keywords":
        #     # keywords stored separately; build EXISTS subquery matching any keyword
        #     if isinstance(value, (list, tuple)) and value:
        #         keyword_preds = []
        #         for idx, keyword in enumerate(value):
        #             key = f"keyword_{idx}"
        #             keyword_preds.append(f"k.keyword ILIKE :{key}")
        #             params[key] = f"%{keyword}%"
        #         exists_sub = (
        #             'EXISTS (SELECT 1 FROM "LocationKeywords" lk '
        #             'JOIN "Keywords" k ON k.id = lk.keyword_id '
        #             'WHERE lk.location_id = "LocationInfo".id AND ('
        #             + " OR ".join(keyword_preds)
        #             + "))"
        #         )
        #         conditions.append(exists_sub)
        #     continue

        if field in ["location", "description", "address"]:
            conditions.append(f"{field} ILIKE :{field}")
            params[field] = f"%{value}%"
            continue

        if field in [
            "outdoor",
            "group_activity",
            "vegetarian",
            "drinks",
            "food",
            "accessible",
            "reservation_needed",
            "pet_friendly",
        ]:
            if value is False:
                # False means no preference: don't filter on this field
                continue
            conditions.append(f"{field} IS :{field}")
            params[field] = value
            continue

        if field in ["open_time", "close_time"]:
            # assume "HH:MM" string format; lexical compare works for zero-padded times
            if field == "open_time":
                conditions.append(f"open_time <= :open_time")
                params["open_time"] = value
            else:
                conditions.append(f"close_time >= :close_time")
                params["close_time"] = value
            continue

        if field == "google_rating":
            conditions.append(f"google_rating >= :google_rating")
            params[field] = value
            continue

        if field == "price_range":
            conditions.append(f"price_range = :price_range")
            params[field] = value
            continue

        # default equality
        conditions.append(f"{field} = :{field}")
        params[field] = value

    return conditions, params


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
                "open_time": location.open_time,
                "close_time": location.close_time,
                "address": location.address,
                "google_rating": location.google_rating,
                "price_range": location.price_range,
                "outdoor": location.outdoor,
                "group_activity": location.group_activity,
                "vegetarian": location.vegetarian,
                "drinks": location.drinks,
                "food": location.food,
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
        "open_time": location.open_time,
        "close_time": location.close_time,
        "address": location.address,
        "google_rating": location.google_rating,
        "price_range": location.price_range,
        "outdoor": location.outdoor,
        "group_activity": location.group_activity,
        "vegetarian": location.vegetarian,
        "drinks": location.drinks,
        "food": location.food,
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
        open_time=location_data.open_time,
        close_time=location_data.close_time,
        address=location_data.address,
        google_rating=location_data.google_rating,
        price_range=location_data.price_range,
        outdoor=location_data.outdoor,
        group_activity=location_data.group_activity,
        vegetarian=location_data.vegetarian,
        drinks=location_data.drinks,
        food=location_data.food,
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
    # build conditions and params using the shared helper
    conditions, params = build_location_filters(query.model_dump())
    if not conditions:
        raise HTTPException(
            status_code=400, detail="At least one search parameter must be provided"
        )
    sql = """SELECT * FROM "LocationInfo" WHERE """ + " AND ".join(conditions)
    locations = db.execute(text(sql), params).fetchall()
    formatted_locations = []
    for location in locations:
        formatted_locations.append(
            {
                "id": location.id,
                "location": location.location,
                "description": location.description,
                "open_time": location.open_time,
                "close_time": location.close_time,
                "address": location.address,
                "google_rating": location.google_rating,
                "price_range": location.price_range,
                "outdoor": location.outdoor,
                "group_activity": location.group_activity,
                "vegetarian": location.vegetarian,
                "drinks": location.drinks,
                "food": location.food,
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
        SELECT * FROM "EventsInfo" WHERE id = :event_id
        """
        ),
        {"event_id": event_id},
    ).fetchone()
    if event_config is None:
        raise HTTPException(status_code=404, detail="Event not found")
    formatted_event_config = {
        "open_time": event_config.open_time,
        "close_time": event_config.close_time,
        "price_range": event_config.price_range,
        "outdoor": event_config.outdoor,
        "group_activity": event_config.group_activity,
        "vegetarian": event_config.vegetarian,
        "drinks": event_config.drinks,
        "food": event_config.food,
        "accessible": event_config.accessible,
        "formal_attire": event_config.formal_attire,
    }
    # reuse the same filter builder so event filtering matches search behavior
    conditions, params = build_location_filters(formatted_event_config)
    if not conditions:
        raise HTTPException(
            status_code=400, detail="No criteria found for event filtering"
        )
    sql = """SELECT * FROM "LocationInfo" WHERE """ + " AND ".join(conditions)
    locations = db.execute(text(sql), params).fetchall()
    if not locations:
        raise HTTPException(
            status_code=404, detail="No locations found matching event criteria"
        )
    return {"locations": locations}


@location_router.post("/add_google_reviews", status_code=status.HTTP_200_OK)
def add_google_reviews_to_location(review: AddReviewRequest, db: db_dependency):
    entry = ReviewData(
        location_id=review.location_id,
        user_review=review.user_review,
        user_rating=review.user_rating,
    )
    db.add(entry)
    db.commit()
    return {"detail": "Review added successfully"}


@location_router.get("/delete_location/{location_id}", status_code=status.HTTP_200_OK)
def delete_location(location_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    # check if location exists
    validate_location_id = db.execute(
        text('SELECT id FROM "LocationInfo" WHERE id = :location_id'),
        {"location_id": location_id},
    ).fetchone()
    if not validate_location_id:
        raise HTTPException(status_code=404, detail="Location not found")

    db.execute(
        text('DELETE FROM "ReviewData" WHERE location_id = :location_id'),
        {"location_id": location_id},
    )
    db.commit()
    # delete location
    db.execute(
        text('DELETE FROM "LocationInfo" WHERE id = :location_id'),
        {"location_id": location_id},
    )
    db.commit()
    return {"message": "Location deleted successfully"}
