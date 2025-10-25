from pydantic import BaseModel
from sqlalchemy import Column, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import mapped_column, relationship
from backend.database import Base

# own user table
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

# own table for storing location information
class LocationInfo(Base):
    __tablename__ = "LocationInfo"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    description = Column(String)
    address = Column(String)
    reviews = relationship("ReviewData", back_populates="location")
    google_rating = Column(Integer) # avg
    price_range = Column(String) 
    outdoor = Column(Boolean) # whether outdoor seating/area is available
    group_activity = Column(Boolean)
    vegetarian_options = Column(Boolean)
    drinks = Column(Boolean)
    food_available = Column(Boolean)
    accessible = Column(Boolean)
    formal_attire = Column(Boolean)
    reservation_needed = Column(Boolean)

class ReviewData(Base):
    __tablename__ = "ReviewData"
    id = Column(Integer, primary_key=True, index=True)
    location_id = mapped_column(ForeignKey("LocationInfo.id"))
    user_review = Column(String)
    user_rating = Column(Integer)
    location = relationship("LocationInfo", back_populates="reviews")

# own table for the different events that get made by event planner
class EventsInfo(Base):
    __tablename__ = "EventsInfo"
    id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String)
    event_date = Column(String)
    location = relationship("LocationInfo") # idk if this is gonna work
    description = Column(String)
    attendees = relationship("EventUsers", back_populates="event")


class EventUsers(Base):
    __tablename__ = "EventUsers"
    id = Column(Integer, primary_key=True, index=True)
    event_id = mapped_column(ForeignKey("EventsInfo.id"))
    user_id = mapped_column(ForeignKey("Users.id"))
    event = relationship("EventsInfo", back_populates="attendees")
    user = relationship("Users", back_populates="events")

class UserRankings(Base):
    __tablename__ = "UserRankings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = mapped_column(ForeignKey("Users.id"))
    location_id = mapped_column(ForeignKey("LocationInfo.id"))
    ranking = Column(Integer)




