from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from backend import events
from backend.dependencies import db_dependency as db_dependency
from backend.auth import get_current_user
from starlette import status

from backend.locations import get_location_for_event

user_dependency = Annotated[dict, Depends(get_current_user)]
result_router = APIRouter(prefix="/results", tags=["events", "matching"])

@result_router.get("/get_result/{event_id}", status_code=status.HTTP_200_OK)
async def get_event_result(event_id: int, user: user_dependency, db: db_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication Failed")
    users_attending = events.get_event_attendees(event_id,user,db)
    if not users_attending:
        raise HTTPException(status_code=404, detail="No attendees found for this event")
    user_ids = [user['id'] for user in users_attending]
    locations = get_location_for_event(event_id, user, db)
    if not locations:
        raise HTTPException(status_code=404, detail="No locations found for this event")
    
    user_rankings = {}
    for uid in user_ids:
        rankings = db.execute(
            text("""
            SELECT "location_id", ranking FROM "UserRankings" WHERE "user_id" = :user_id
            """),
            {"user_id": uid}
        ).fetchall()
        user_rankings[uid] = {rank.location_id: rank.ranking for rank in rankings}
    
    location_scores = {}
    for location in locations:
        loc_id = location['id']
        total_score = 0
        count = 0
        for uid in user_ids:
            if loc_id in user_rankings.get(uid, {}):
                total_score += user_rankings[uid][loc_id]
                count += 1
        if count > 0:
            average_score = total_score / count
            location_scores[loc_id] = average_score

    sorted_locations = sorted(location_scores.items(), key=lambda x: x[1], reverse=True)

    return {"ranked_locations": sorted_locations}