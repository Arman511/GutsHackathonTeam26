CREATE TABLE IF NOT EXISTS "Users" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    username TEXT UNIQUE,
    hashed_password TEXT
);

CREATE INDEX IF NOT EXISTS ix_users_id ON "Users" (id);

CREATE TABLE IF NOT EXISTS "LocationInfo" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT UNIQUE,
    open_time TEXT,
    close_time TEXT,
    address TEXT,
    description TEXT,
    google_rating REAL,
    price_range TEXT,
    outdoor BOOLEAN,
    group_activity BOOLEAN,
    vegetarian BOOLEAN,
    drinks BOOLEAN,
    food BOOLEAN,
    pet_friendly BOOLEAN,
    accessible BOOLEAN,
    formal_attire BOOLEAN,
    reservation_needed BOOLEAN,
    image_url TEXT
);

CREATE INDEX IF NOT EXISTS ix_locationinfo_id ON "LocationInfo" (id);

CREATE TABLE IF NOT EXISTS "Keywords" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    keyword TEXT
);

CREATE INDEX IF NOT EXISTS ix_keywords_id ON "Keywords" (id);

CREATE TABLE IF NOT EXISTS "EventsInfo" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    event_name TEXT,
    event_date TEXT,
    description TEXT,
    outdoor BOOLEAN,
    price_range TEXT,
    group_activity BOOLEAN,
    vegetarian BOOLEAN,
    drinks BOOLEAN,
    food BOOLEAN,
    accessible BOOLEAN,
    formal_attire BOOLEAN,
    open_time TEXT,
    close_time TEXT,
    FOREIGN KEY (user_id) REFERENCES "Users" (id)
);

CREATE INDEX IF NOT EXISTS ix_eventsinfo_id ON "EventsInfo" (id);

CREATE TABLE IF NOT EXISTS "LocationKeywords" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER,
    keyword_id INTEGER,
    FOREIGN KEY (location_id) REFERENCES "LocationInfo" (id),
    FOREIGN KEY (keyword_id) REFERENCES "Keywords" (id)
);

CREATE INDEX IF NOT EXISTS ix_locationkeywords_id ON "LocationKeywords" (id);

CREATE TABLE IF NOT EXISTS "ReviewData" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER,
    user_review TEXT,
    user_rating INTEGER,
    FOREIGN KEY (location_id) REFERENCES "LocationInfo" (id)
);

CREATE INDEX IF NOT EXISTS ix_reviewdata_id ON "ReviewData" (id);

CREATE TABLE IF NOT EXISTS "EventUsers" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_id INTEGER,
    user_id INTEGER,
    FOREIGN KEY (event_id) REFERENCES "EventsInfo" (id),
    FOREIGN KEY (user_id) REFERENCES "Users" (id)
);

CREATE INDEX IF NOT EXISTS ix_eventusers_id ON "EventUsers" (id);

CREATE TABLE IF NOT EXISTS "UserRankings" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    location_id INTEGER,
    ranking INTEGER,
    FOREIGN KEY (user_id) REFERENCES "Users" (id),
    FOREIGN KEY (location_id) REFERENCES "LocationInfo" (id)
);

CREATE INDEX IF NOT EXISTS ix_userrankings_id ON "UserRankings" (id);
