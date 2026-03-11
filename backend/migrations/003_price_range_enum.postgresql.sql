BEGIN;

-- create enum type if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'price_range_enum') THEN
        CREATE TYPE price_range_enum AS ENUM ('£','££','£££');
    END IF;
END$$;

-- alter column type and convert existing values
ALTER TABLE "LocationInfo"
    ALTER COLUMN price_range TYPE price_range_enum
    USING
        CASE
            -- pull first numeric value from price_range string
            WHEN (regexp_replace(price_range, '^.*?([0-9]+).*$', '\1'))::int < 10 THEN '£'
            WHEN (regexp_replace(price_range, '^.*?([0-9]+).*$', '\1'))::int BETWEEN 10 AND 20 THEN '££'
            ELSE '£££'
        END::price_range_enum;

COMMIT;
