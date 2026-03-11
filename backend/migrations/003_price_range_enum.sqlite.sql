PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

-- rename old table
ALTER TABLE "LocationInfo" RENAME TO _LocationInfo_old;

-- create new table with constraint on price_range
CREATE TABLE "LocationInfo" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT UNIQUE,
    open_time TEXT,
    close_time TEXT,
    address TEXT,
    description TEXT,
    google_rating REAL,
    price_range TEXT CHECK (price_range IN ('£','££','£££')),
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

-- copy data converting existing values to one of the three categories
INSERT INTO "LocationInfo" (
    id, location, open_time, close_time, address, description,
    google_rating, price_range, outdoor, group_activity,
    vegetarian, drinks, food, pet_friendly, accessible,
    formal_attire, reservation_needed, image_url
)
SELECT
    id, location, open_time, close_time, address, description,
    google_rating,
    CASE
        -- extract leading number from price_range text and categorize
        WHEN CAST(
                CASE
                    WHEN instr(replace(price_range,'£',''),' -')>0 THEN substr(replace(price_range,'£',''),1,instr(replace(price_range,'£',''),' -')-1)
                    WHEN instr(replace(price_range,'£',''),'-')>0 THEN substr(replace(price_range,'£',''),1,instr(replace(price_range,'£',''),'-')-1)
                    ELSE trim(replace(price_range,'£',''))
                END AS INTEGER
             ) < 10 THEN '£'
        WHEN CAST(
                CASE
                    WHEN instr(replace(price_range,'£',''),' -')>0 THEN substr(replace(price_range,'£',''),1,instr(replace(price_range,'£',''),' -')-1)
                    WHEN instr(replace(price_range,'£',''),'-')>0 THEN substr(replace(price_range,'£',''),1,instr(replace(price_range,'£',''),'-')-1)
                    ELSE trim(replace(price_range,'£',''))
                END AS INTEGER
             ) BETWEEN 10 AND 20 THEN '££'
        ELSE '£££'
    END as price_range,
    outdoor, group_activity, vegetarian, drinks, food, pet_friendly,
    accessible, formal_attire, reservation_needed, image_url
FROM _LocationInfo_old;

-- drop old table and re-enable foreign keys
DROP TABLE _LocationInfo_old;

COMMIT;

PRAGMA foreign_keys=on;
