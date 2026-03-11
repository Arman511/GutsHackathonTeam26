BEGIN;

-- add 100 random fake locations reusing existing image URLs
INSERT INTO "LocationInfo" (
    location, open_time, close_time, address, description,
    google_rating, price_range, outdoor, group_activity, vegetarian,
    drinks, food, pet_friendly, accessible, formal_attire,
    reservation_needed, image_url
)
SELECT
    'Fake Place ' || g as location,
    to_char((floor(random()*24))::int,'FM00') || ':00' as open_time,
    to_char((floor(random()*24))::int,'FM00') || ':00' as close_time,
    '123 Fake St, City ' || g as address,
    'Auto-generated fake location ' || g as description,
    3 + random()*5 as google_rating,
    CASE floor(random()*3)
        WHEN 0 THEN '£' WHEN 1 THEN '££' ELSE '£££' END as price_range,
    (random() < 0.5) as outdoor,
    (random() < 0.5) as group_activity,
    (random() < 0.5) as vegetarian,
    (random() < 0.5) as drinks,
    (random() < 0.5) as food,
    (random() < 0.5) as pet_friendly,
    (random() < 0.5) as accessible,
    (random() < 0.5) as formal_attire,
    (random() < 0.5) as reservation_needed,
    CASE (g % 10)
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
    END as image_url
FROM generate_series(1,100) AS g;

COMMIT;
