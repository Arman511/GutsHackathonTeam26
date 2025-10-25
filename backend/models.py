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
    events = relationship("EventUsers", back_populates="user")


class CreateUserRequest(BaseModel):
    name: str
    username: str
    password: str


class CreateEventRequest(BaseModel):
    event_name: str
    event_date: str
    location: int
    description: str
    price_range: str
    outdoor: bool
    group_activity: bool
    vegetarian_options: bool
    drinks: bool
    food_available: bool
    accessible: bool
    formal_attire: bool


class CreateLocationRequest(BaseModel):
    location: str
    description: str
    address: str
    google_rating: int
    price_range: str
    outdoor: bool
    group_activity: bool
    vegetarian_options: bool
    drinks: bool
    food_available: bool
    accessible: bool
    formal_attire: bool
    reservation_needed: bool
    image_url: str


class LocationSearchRequest(BaseModel):
    keywords: list[str]
    location: str | None = None
    description: str | None = None
    address: str | None = None
    google_rating: int | None = None
    price_range: str | None = None
    outdoor: bool | None = None
    group_activity: bool | None = None
    vegetarian_options: bool | None = None
    drinks: bool | None = None
    food_available: bool | None = None
    accessible: bool | None = None
    formal_attire: bool | None = None
    reservation_needed: bool | None = None
    image_url: str | None = None


class LocationRankingRequest(BaseModel):
    location_id: int
    ranking: int


class CreateKeywordRequest(BaseModel):
    keyword: str


class Token(BaseModel):
    access_token: str
    token_type: str


# own table for storing location information
class LocationInfo(Base):
    __tablename__ = "LocationInfo"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String, unique=True)
    description = Column(String)
    address = Column(String)
    reviews = relationship("ReviewData", back_populates="location")
    google_rating = Column(Integer)  # avg
    price_range = Column(String)
    outdoor = Column(Boolean)  # whether outdoor seating/area is available
    group_activity = Column(Boolean)
    vegetarian_options = Column(Boolean)
    drinks = Column(Boolean)
    food_available = Column(Boolean)
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


# own table for the different events that get made by event planner
class EventsInfo(Base):
    __tablename__ = "EventsInfo"
    id = Column(Integer, primary_key=True, index=True)
    user_id = mapped_column(ForeignKey("Users.id"))
    event_name = Column(String)
    event_date = Column(String)
    location = mapped_column(ForeignKey("LocationInfo.id"))
    description = Column(String)
    attendees = relationship("EventUsers", back_populates="event")


class EventConfigurations(Base):
    __tablename__ = "EventConfigurations"
    id = Column(Integer, primary_key=True, index=True)
    event_id = mapped_column(ForeignKey("EventsInfo.id"))
    price_range = Column(String)
    group_activity = Column(Boolean)
    vegetarian_options = Column(Boolean)
    drinks = Column(Boolean)
    food_available = Column(Boolean)
    accessible = Column(Boolean)
    formal_attire = Column(Boolean)


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
