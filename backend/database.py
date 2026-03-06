import os
from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv


load_dotenv()

DB_HOST = os.getenv("DB_HOST", "localhost")
DB_NAME = os.getenv("DB_NAME", "nightout_recommender_db")
DB_USER = os.getenv("DB_USER", "db_user")
DB_PASSWORD = os.getenv("DB_PASSWORD", "db_pass")
DB_PORT = os.getenv("DB_PORT", 5432)
DB_DIALECT = os.getenv("DB_DIALECT", "postgresql").lower()
SQLITE_DB_PATH = os.getenv("SQLITE_DB_PATH", "./data/nightout_recommender.db")
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    URL_DATABASE = DATABASE_URL
elif DB_DIALECT == "sqlite":
    if SQLITE_DB_PATH == ":memory:":
        URL_DATABASE = "sqlite:///:memory:"
    else:
        sqlite_db_dir = Path(SQLITE_DB_PATH).expanduser().resolve().parent
        sqlite_db_dir.mkdir(parents=True, exist_ok=True)
        URL_DATABASE = f"sqlite:///{SQLITE_DB_PATH}"
else:
    URL_DATABASE = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine_kwargs = {}
if URL_DATABASE.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(URL_DATABASE, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
