PRAGMA foreign_keys = off;

BEGIN TRANSACTION;

-- delete approximately 80% of locations whose name contains 'Fake'
DELETE FROM "LocationInfo"
WHERE
    location LIKE '%Fake%'
    AND (abs(random ()) % 100) < 90;

COMMIT;

PRAGMA foreign_keys = on;
