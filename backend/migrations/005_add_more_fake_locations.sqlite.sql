PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

-- add 1000 random fake locations with minimal details
WITH RECURSIVE nums(n) AS (
    SELECT 101
    UNION ALL
    SELECT n+1 FROM nums WHERE n < 1100
)
INSERT INTO "LocationInfo" (
    location, open_time, close_time, address, description,
    google_rating, price_range, outdoor, group_activity, vegetarian,
    drinks, food, pet_friendly, accessible, formal_attire,
    reservation_needed, image_url
)
SELECT
    'Fake Place '||n,
    '00:00',
    '00:00',
    '',
    '',
    ((abs(random()) % 5) + 1),
    CASE
        WHEN abs(random()) % 100 < 60 THEN '£'
        WHEN abs(random()) % 100 < 85 THEN '££' ELSE '£££' END,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    CASE abs(random()) % 10
        WHEN 1 THEN 'https://images.happycow.net/venues/1024/16/05/hcmp160574_3015942.jpeg'
        WHEN 2 THEN 'https://images.happycow.net/venues/1024/11/77/hcmp11778_284719.jpeg'
        WHEN 3 THEN 'https://static.designmynight.com/uploads/2024/06/New-glasgow-phone-optimised.png'
        WHEN 4 THEN 'https://images.squarespace-cdn.com/content/v1/5f96ae852e14f81cac176e94/78c4cf35-4a03-4409-96e5-4502f90c2678/0F6A2034.jpg'
        WHEN 5 THEN 'https://images.squarespace-cdn.com/content/v1/6335762304974d1b2715ac96/ff948237-ac87-462a-9a30-c0e998251a4e/Untitled+design+%2845%29.jpg'
        WHEN 6 THEN 'https://media.timeout.com/images/101765607/image.jpg'
        WHEN 7 THEN 'https://theescaperoomer.com/wp-content/uploads/2024/05/IMG_4907.jpg'
        WHEN 8 THEN 'https://www.bowlarama.co.uk/wp-content/uploads/2020/06/carousel7.jpg'
        WHEN 9 THEN 'https://images.squarespace-cdn.com/content/v1/62ab7214dc37044b75c43091/e7a8dda4-79e8-49a2-99c5-f851784a892f/Great+Western+Golf_Aug_2023_Lucy+Knott+Photography+%2824%29.jpg'
        ELSE 'https://cdn.mbplc.io/step-gateway-external/06/07/4470607.jpg'
    END
FROM nums;

COMMIT;

PRAGMA foreign_keys=on;
