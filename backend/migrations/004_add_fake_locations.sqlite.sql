PRAGMA foreign_keys=off;

BEGIN TRANSACTION;

-- generate 100 fake rows using a recursive CTE
WITH RECURSIVE nums(n) AS (
    SELECT 1
    UNION ALL
    SELECT n+1 FROM nums WHERE n < 100
)
INSERT INTO "LocationInfo" (
    location, open_time, close_time, address, description,
    google_rating, price_range, outdoor, group_activity, vegetarian,
    drinks, food, pet_friendly, accessible, formal_attire,
    reservation_needed, image_url
)
SELECT
    'Fake Place '||n,
    printf('%02d:00', abs(random()) % 24),
    printf('%02d:00', abs(random()) % 24),
    '123 Fake St, City '||n,
    'Auto-generated fake location '||n,
    (abs(random()) % 50) / 10.0 + 3.0,
    CASE abs(random()) % 3 WHEN 0 THEN '£' WHEN 1 THEN '££' ELSE '£££' END,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    abs(random()) % 2,
    CASE (n - 1) % 10
        WHEN 0 THEN 'https://images.happycow.net/venues/1024/16/05/hcmp160574_3015942.jpeg'
        WHEN 1 THEN 'https://images.happycow.net/venues/1024/11/77/hcmp11778_284719.jpeg'
        WHEN 2 THEN 'https://static.designmynight.com/uploads/2024/06/New-glasgow-phone-optimised.png'
        WHEN 3 THEN 'https://images.squarespace-cdn.com/content/v1/5f96ae852e14f81cac176e94/78c4cf35-4a03-4409-96e5-4502f90c2678/0F6A2034.jpg'
        WHEN 4 THEN 'https://images.squarespace-cdn.com/content/v1/6335762304974d1b2715ac96/ff948237-ac87-462a-9a30-c0e998251a4e/Untitled+design+%2845%29.jpg'
        WHEN 5 THEN 'https://media.timeout.com/images/101765607/image.jpg'
        WHEN 6 THEN 'https://theescaperoomer.com/wp-content/uploads/2024/05/IMG_4907.jpg'
        WHEN 7 THEN 'https://www.bowlarama.co.uk/wp-content/uploads/2020/06/carousel7.jpg'
        WHEN 8 THEN 'https://images.squarespace-cdn.com/content/v1/62ab7214dc37044b75c43091/e7a8dda4-79e8-49a2-99c5-f851784a892f/Great+Western+Golf_Aug_2023_Lucy+Knott+Photography+%2824%29.jpg'
        ELSE 'https://cdn.mbplc.io/step-gateway-external/06/07/4470607.jpg'
    END
FROM nums;

COMMIT;

PRAGMA foreign_keys=on;
