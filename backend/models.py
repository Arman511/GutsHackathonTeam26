from numbers import Real
from pydantic import BaseModel
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Boolean
from sqlalchemy.orm import mapped_column, relationship
from backend.database import Base


# own user table
class Users(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    events = relationship("EventUsers", back_populates="user")


class CreateUserRequest(BaseModel):
    name: str
    username: str
    password: str


class CreateEventRequest(BaseModel):
    event_name: str
    event_date: str
    description: str
    price_range: str
    outdoor: bool
    group_activity: bool
    vegetarian: bool
    drinks: bool
    food: bool
    accessible: bool
    formal_attire: bool
    open_time: str
    close_time: str


class CreateLocationRequest(BaseModel):
    location: str
    open_time: str
    close_time: str
    description: str
    address: str
    google_rating: int
    price_range: str
    outdoor: bool
    group_activity: bool
    vegetarian: bool
    drinks: bool
    food: bool
    pet_friendly: bool
    accessible: bool
    formal_attire: bool
    reservation_needed: bool
    image_url: str


class LocationSearchRequest(BaseModel):
    # keywords: list[str]
    location: str | None = None
    open_time: str | None = None
    close_time: str | None = None
    description: str | None = None
    address: str | None = None
    google_rating: int | None = None
    price_range: str | None = None
    outdoor: bool | None = None
    group_activity: bool | None = None
    vegetarian: bool | None = None
    drinks: bool | None = None
    food: bool | None = None
    pet_friendly: bool | None = None
    accessible: bool | None = None
    formal_attire: bool | None = None
    reservation_needed: bool | None = None


class LocationRankingRequest(BaseModel):
    location_id: int
    ranking: int


class AddUserToEventRequest(BaseModel):
    user_id: int


class CreateKeywordRequest(BaseModel):
    keyword: str


class AttendEventRequest(BaseModel):
    user_id: int


class Token(BaseModel):
    access_token: str
    token_type: str


# own table for storing location information
class LocationInfo(Base):
    __tablename__ = "LocationInfo"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, unique=True)
    open_time = Column(String)
    close_time = Column(String)
    address = Column(String)
    description = Column(String)
    reviews = relationship("ReviewData", back_populates="location")
    google_rating = Column(Float)  # avg
    price_range = Column(String)
    outdoor = Column(Boolean)  # whether outdoor seating/area is available
    group_activity = Column(Boolean)
    vegetarian = Column(Boolean)
    drinks = Column(Boolean)
    food = Column(Boolean)
    pet_friendly = Column(Boolean)
    accessible = Column(Boolean)
    formal_attire = Column(Boolean)
    reservation_needed = Column(Boolean)
    image_url = Column(String)


class Keywords(Base):
    __tablename__ = "Keywords"
    id = Column(Integer, primary_key=True, index=True)
    keyword = Column(String)


class LocationKeywords(Base):
    __tablename__ = "LocationKeywords"
    id = Column(Integer, primary_key=True, index=True)
    location_id = mapped_column(ForeignKey("LocationInfo.id"))
    keyword_id = mapped_column(ForeignKey("Keywords.id"))


class ReviewData(Base):
    __tablename__ = "ReviewData"
    id = Column(Integer, primary_key=True, index=True)
    location_id = mapped_column(ForeignKey("LocationInfo.id"))
    user_review = Column(String)
    user_rating = Column(Integer)
    location = relationship("LocationInfo", back_populates="reviews")


class AddReviewRequest(BaseModel):
    location_id: int
    user_review: str
    user_rating: int


# own table for the different events that get made by event planner
class EventsInfo(Base):
    __tablename__ = "EventsInfo"
    id = Column(Integer, primary_key=True, index=True)
    user_id = mapped_column(ForeignKey("Users.id"))
    event_name = Column(String)
    event_date = Column(String)
    description = Column(String)
    attendees = relationship("EventUsers", back_populates="event")
    outdoor = Column(Boolean)
    price_range = Column(String)
    group_activity = Column(Boolean)
    vegetarian = Column(Boolean)
    drinks = Column(Boolean)
    food = Column(Boolean)
    accessible = Column(Boolean)
    formal_attire = Column(Boolean)
    open_time = Column(String)
    close_time = Column(String)


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
