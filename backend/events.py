from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

user_dependency = Annotated[dict, Depends(get_current_user)]
event_router = APIRouter(prefix="/events", tags=["events"])


@event_router.get("/all_events", status_code=status.HTTP_200_OK)
async def get_all_events(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    events = db.execute(
        text(
            """
        SELECT * FROM "EventsInfo"
        """
        )
    ).fetchall()
    formatted_events = []
    for event in events:
        formatted_events.append(
            {
                "id": event.id,
                "event_name": event.event_name,
                "event_date": event.event_date,
                "location": event.location,
                "description": event.description,
            }
        )
    return {"events": formatted_events}


@event_router.get("/event/{event_id}", status_code=status.HTTP_200_OK)
async def get_event(event_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    event = db.execute(
        text(
            """
        SELECT * FROM "EventsInfo" WHERE id = :event_id
        """
        ),
        {"event_id": event_id},
    ).fetchone()
    if event is None:
        raise HTTPException(status_code=404, detail="Event not found")
    formatted_event = {
        "id": event.id,
        "event_name": event.event_name,
        "event_date": event.event_date,
        "location": event.location,
        "description": event.description,
    }
    return {"event": formatted_event}


@event_router.get("/my_attending_events", status_code=status.HTTP_200_OK)
async def get_attending_events(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    events = db.execute(
        text(
            """
        SELECT e.* FROM "EventsInfo" e
        JOIN "EventUsers" eu ON e.id = eu.event_id
        WHERE eu.user_id = :user_id
        """
        ),
        {"user_id": user_id},
    ).fetchall()
    if not events:
        return {"events": []}
    formatted_events = []
    for event in events:
        formatted_events.append(
            {
                "id": event.id,
                "event_name": event.event_name,
                "event_date": event.event_date,
                "location": event.location,
                "description": event.description,
            }
        )
    return {"events": formatted_events}


@event_router.get("/my_created_events")
async def get_created_events(user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    events = db.execute(
        text(
            """
        SELECT * FROM "EventsInfo" WHERE user_id = :user_id
        """
        ),
        {"user_id": user_id},
    ).fetchall()
    if not events:
        return {"events": []}
    formatted_events = []
    for event in events:
        formatted_events.append(
            {
                "id": event.id,
                "event_name": event.event_name,
                "event_date": event.event_date,
                "location": event.location,
                "description": event.description,
            }
        )
    return {"events": formatted_events}


from backend.models import (
    AttendEventRequest,
    CreateEventRequest,
    EventsInfo,
    EventUsers,
)


@event_router.post("/create_event", status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: CreateEventRequest, user: user_dependency, db: db_dependency
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    user_id = int(user["id"])
    new_event = EventsInfo(
        user_id=user_id,
        event_name=event_data.event_name,
        event_date=event_data.event_date,
        location=event_data.location,
        description=event_data.description,
        price_range=event_data.price_range,
        group_activity=event_data.group_activity,
        vegetarian=event_data.vegetarian,
        drinks=event_data.drinks,
        food=event_data.food,
        accessible=event_data.accessible,
        formal_attire=event_data.formal_attire,
        open_time=event_data.open_time,
        close_time=event_data.close_time,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)

    # Add the creator as an attendee
    event_user = EventUsers(event_id=new_event.id, user_id=user_id)
    db.add(event_user)
    db.commit()

    return {"message": "Event created successfully", "event_id": new_event.id}


@event_router.get("/event_attendees/{event_id}", status_code=status.HTTP_200_OK)
async def get_event_attendees(event_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    attendees = db.execute(
        text(
            """
        SELECT u.id, u.name, u.username FROM "Users" u
        JOIN "EventUsers" eu ON u.id = eu.user_id
        WHERE eu.event_id = :event_id
        """
        ),
        {"event_id": event_id},
    ).fetchall()
    formatted_attendees = []
    for attendee in attendees:
        formatted_attendees.append(
            {"id": attendee.id, "name": attendee.name, "username": attendee.username}
        )
    return {"attendees": formatted_attendees}


@event_router.post("/attend_event/{event_id}", status_code=status.HTTP_200_OK)
async def attend_event(
    event_id: int,
    user: user_dependency,
    db: db_dependency,
    user_id: AttendEventRequest,
):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")

    validate_user_id = db.execute(
        text('SELECT id FROM "Users" WHERE id = :user_id'),
        {"user_id": user_id.user_id},
    ).fetchone()
    if not validate_user_id:
        raise HTTPException(status_code=404, detail="User not found")
    validate_event_id = db.execute(
        text('SELECT id FROM "EventsInfo" WHERE id = :event_id'),
        {"event_id": event_id},
    ).fetchone()
    if not validate_event_id:
        raise HTTPException(status_code=404, detail="Event not found")
    existing_attendance = db.execute(
        text(
            'SELECT * FROM "EventUsers" WHERE user_id = :user_id AND event_id = :event_id'
        ),
        {"user_id": user_id.user_id, "event_id": event_id},
    ).fetchone()
    if existing_attendance:
        return {"message": "User is already attending the event"}
    db.execute(
        text(
            'INSERT INTO "EventUsers" (user_id, event_id) VALUES (:user_id, :event_id)'
        ),
        {"user_id": user_id.user_id, "event_id": event_id},
    )
    db.commit()
    return {"message": "Users marked as attending the event successfully"}
