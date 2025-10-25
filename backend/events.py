from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

user_dependency = Annotated[dict, Depends(get_current_user)]
event_router = APIRouter(prefix="/events", tags=["events"])

# from backend.database import engine, Base
# Base.metadata.create_all(bind=engine)

@event_router.post("/populate_db", status_code=status.HTTP_200_OK)
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
        "vegetarian_options": True,
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
    #     INSERT INTO "LocationInfo" (location, description, address, google_rating, price_range, outdoor, group_activity, vegetarian_options, drinks, food_available, accessible, formal_attire, reservation_needed)
    #     VALUES (:location, :description, :address, :google_rating, :price_range, :outdoor, :group_activity, :vegetarian_options, :drinks, :food_available, :accessible, :formal_attire, :reservation_needed)
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


@event_router.get("/all_events", status_code=status.HTTP_200_OK)
async def get_all_events(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    events = db.execute(
        text("""
        SELECT * FROM "EventsInfo"
        """)
    ).fetchall()
    formatted_events = []
    for event in events:
        formatted_events.append({
            "id": event.id,
            "event_name": event.event_name,
            "event_date": event.event_date,
            "location": event.location,
            "description": event.description
        })
    return {"events": formatted_events}

@event_router.get("/event/{event_id}", status_code=status.HTTP_200_OK)
async def get_event(event_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    event = db.execute(
        text("""
        SELECT * FROM "EventsInfo" WHERE id = :event_id
        """),
        {"event_id": event_id}
    ).fetchone()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    formatted_event = {
        "id": event.id,
        "event_name": event.event_name,
        "event_date": event.event_date,
        "location": event.location,
        "description": event.description
    }
    return {"event": formatted_event}

@event_router.get("/my_attending_events", status_code=status.HTTP_200_OK)
async def get_attending_events(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    events = db.execute(
        text("""
        SELECT e.* FROM "EventsInfo" e
        JOIN "EventUsers" eu ON e.id = eu.event_id
        WHERE eu.user_id = :user_id
        """),
        {"user_id": user_id}
    ).fetchall()
    if not events:
        return {"events": []}
    formatted_events = []
    for event in events:
        formatted_events.append({
            "id": event.id,
            "event_name": event.event_name,
            "event_date": event.event_date,
            "location": event.location,
            "description": event.description
        })
    return {"events": formatted_events}

@event_router.get("/my_created_events")
async def get_created_events(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    events = db.execute(
        text("""
        SELECT * FROM "EventsInfo" WHERE user_id = :user_id
        """),
        {"user_id": user_id}
    ).fetchall()
    if not events:
        return {"events": []}
    formatted_events = []
    for event in events:
        formatted_events.append({
            "id": event.id,
            "event_name": event.event_name,
            "event_date": event.event_date,
            "location": event.location,
            "description": event.description
        })
    return {"events": formatted_events}

from backend.models import CreateEventRequest, EventConfigurations, EventsInfo, EventUsers
@event_router.post("/create_event", status_code=status.HTTP_201_CREATED)
async def create_event(event_data: CreateEventRequest, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    new_event = EventsInfo(
        user_id=user_id,
        event_name=event_data.event_name,
        event_date=event_data.event_date,
        location=event_data.location,
        description=event_data.description
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # Add the creator as an attendee
    event_user = EventUsers(
        event_id=new_event.id,
        user_id=user_id
    )
    db.add(event_user)
    db.commit()

    # Create event configurations
    event_config = EventConfigurations(
        event_id=new_event.id,
        price_range=event_data.price_range,
        group_activity=event_data.group_activity,
        vegetarian_options=event_data.vegetarian_options,
        drinks=event_data.drinks,
        food_available=event_data.food_available,
        accessible=event_data.accessible,
        formal_attire=event_data.formal_attire,
    )
    db.add(event_config)
    db.commit()

    return {"message": "Event created successfully", "event_id": new_event.id}


@event_router.get("/event_attendees/{event_id}", status_code=status.HTTP_200_OK)
async def get_event_attendees(event_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    attendees = db.execute(
        text("""
        SELECT u.id, u.name, u.username FROM "Users" u
        JOIN "EventUsers" eu ON u.id = eu.user_id
        WHERE eu.event_id = :event_id
        """),
        {"event_id": event_id}
    ).fetchall()
    formatted_attendees = []
    for attendee in attendees:
        formatted_attendees.append({
            "id": attendee.id,
            "name": attendee.name,
            "username": attendee.username
        })
    return {"attendees": formatted_attendees}