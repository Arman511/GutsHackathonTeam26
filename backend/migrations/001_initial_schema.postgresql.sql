CREATE TABLE IF NOT EXISTS "Users" (
    id SERIAL PRIMARY KEY,
    name TEXT,
    username TEXT UNIQUE,
    hashed_password TEXT
);

CREATE INDEX IF NOT EXISTS ix_users_id ON "Users" (id);

CREATE TABLE IF NOT EXISTS "LocationInfo" (
    id SERIAL PRIMARY KEY,
    location TEXT UNIQUE,
    open_time TEXT,
    close_time TEXT,
    address TEXT,
    description TEXT,
    google_rating DOUBLE PRECISION,
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
    id SERIAL PRIMARY KEY,
    keyword TEXT
);

CREATE INDEX IF NOT EXISTS ix_keywords_id ON "Keywords" (id);

CREATE TABLE IF NOT EXISTS "EventsInfo" (
    id SERIAL PRIMARY KEY,
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
    CONSTRAINT fk_eventsinfo_user_id FOREIGN KEY (user_id) REFERENCES "Users" (id)
);

CREATE INDEX IF NOT EXISTS ix_eventsinfo_id ON "EventsInfo" (id);

CREATE TABLE IF NOT EXISTS "LocationKeywords" (
    id SERIAL PRIMARY KEY,
    location_id INTEGER,
    keyword_id INTEGER,
    CONSTRAINT fk_locationkeywords_location_id FOREIGN KEY (location_id) REFERENCES "LocationInfo" (id),
    CONSTRAINT fk_locationkeywords_keyword_id FOREIGN KEY (keyword_id) REFERENCES "Keywords" (id)
);

CREATE INDEX IF NOT EXISTS ix_locationkeywords_id ON "LocationKeywords" (id);

CREATE TABLE IF NOT EXISTS "ReviewData" (
    id SERIAL PRIMARY KEY,
    location_id INTEGER,
    user_review TEXT,
    user_rating INTEGER,
    CONSTRAINT fk_reviewdata_location_id FOREIGN KEY (location_id) REFERENCES "LocationInfo" (id)
);

CREATE INDEX IF NOT EXISTS ix_reviewdata_id ON "ReviewData" (id);

CREATE TABLE IF NOT EXISTS "EventUsers" (
    id SERIAL PRIMARY KEY,
    event_id INTEGER,
    user_id INTEGER,
    CONSTRAINT fk_eventusers_event_id FOREIGN KEY (event_id) REFERENCES "EventsInfo" (id),
    CONSTRAINT fk_eventusers_user_id FOREIGN KEY (user_id) REFERENCES "Users" (id)
);

CREATE INDEX IF NOT EXISTS ix_eventusers_id ON "EventUsers" (id);

CREATE TABLE IF NOT EXISTS "UserRankings" (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    location_id INTEGER,
    ranking INTEGER,
    CONSTRAINT fk_userrankings_user_id FOREIGN KEY (user_id) REFERENCES "Users" (id),
    CONSTRAINT fk_userrankings_location_id FOREIGN KEY (location_id) REFERENCES "LocationInfo" (id)
);

CREATE INDEX IF NOT EXISTS ix_userrankings_id ON "UserRankings" (id);
