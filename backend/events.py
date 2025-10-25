from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

user_dependency = Annotated[dict, Depends(get_current_user)]
event_router = APIRouter(prefix="/events", tags=["events"])

@event_router.post("/populate_db", status_code=status.HTTP_200_OK)
async def populate_db(user: user_dependency, db: db_dependency):
    # Logic to populate the database with initial event data
    sample_event = {
        "event_name": "Christmas Dinner",
        "event_date": "2024-12-31",
        "location": "Sugo",
        "description": "This is WCRT's annual Christmas dinner event.",
        "attendees": ["Alice", "Bob", "Charlie"]
    }
    db.execute(
        """
        INSERT INTO EventsInfo (event_name, event_date, location, description, attendees)
        VALUES (:event_name, :event_date, :location, :description, :attendees)
        """,
        sample_event
    )
    db.commit()

    return {"message": "Database populated with initial event data"}