BEGIN;

-- delete approximately 90% of locations whose name contains 'Fake'
DELETE FROM "LocationInfo"
WHERE location LIKE '%Fake%'
  AND random() < 0.9;  -- PostgreSQL random() returns float [0,1)

COMMIT;
