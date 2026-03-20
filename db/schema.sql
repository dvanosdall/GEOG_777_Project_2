/*
  Name:      David Vanosdall
  Date:      3/17/2026
  Class:     GEOG 777 Project 2

  Description:
    This schema defines the database structure for a mobile-friendly park map application.
    It uses PostgreSQL with the PostGIS extension for spatial support.

    Tables included:
    - park:          Stores park boundaries (Polygon geometry)
    - feature:       Points of interest/features within parks (Point geometry)
    - trail:         Trails/routes within parks (LineString geometry)
    - facility:      Facilities such as restrooms, kiosks, etc. (Point geometry)
    - user_submission: User-submitted spatial data, comments, or reports (Point geometry)
      Each submission includes the submitter's email address.

    Relationships:
    - Many entities reference park_id as a foreign key
    - Features, trails, and facilities are linked to parks
    - User_submissions can reference features and trails

    Data integrity:
    - Foreign keys use ON DELETE CASCADE so that when a park is deleted,
      all associated features, trails, facilities, and user submissions are automatically deleted,
      preventing orphaned records.
    - User submissions reference features and trails using ON DELETE SET NULL,
      so if a feature or trail is deleted, the submission remains but its reference is cleared.
*/

-- Enable PostGIS extension (run once per database)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Park table
CREATE TABLE IF NOT EXISTS park (
    park_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    boundary GEOMETRY(Polygon, 4326)
);

-- Check if park exists
SELECT park_id FROM park WHERE name = 'Eugene T. Mahoney State Park';

-- If NOT exists, insert default park row
INSERT INTO park (name, boundary)
SELECT
  'Eugene T. Mahoney State Park',
  ST_SetSRID(ST_GeomFromText('POLYGON((-96.3200 41.0200, -96.3200 41.0330, -96.3050 41.0330, -96.3050 41.0200, -96.3200 41.0200))'), 4326)
WHERE NOT EXISTS (
  SELECT 1 FROM park WHERE name = 'Eugene T. Mahoney State Park'
);

-- Feature table
CREATE TABLE IF NOT EXISTS feature (
    feature_id SERIAL PRIMARY KEY,
    park_id INTEGER REFERENCES park(park_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    description TEXT,
    geom GEOMETRY(Point, 4326)
);

-- Trail table
CREATE TABLE IF NOT EXISTS trail (
    trail_id SERIAL PRIMARY KEY,
    park_id INTEGER REFERENCES park(park_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    length FLOAT,
    geom GEOMETRY(LineString, 4326)
);

-- Facility table
CREATE TABLE IF NOT EXISTS facility (
    facility_id SERIAL PRIMARY KEY,
    park_id INTEGER REFERENCES park(park_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50),
    accessibility BOOLEAN,
    geom GEOMETRY(Point, 4326)
);

-- UserSubmission table
CREATE TABLE IF NOT EXISTS user_submission (
    submission_id SERIAL PRIMARY KEY,
    park_id INTEGER REFERENCES park(park_id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES feature(feature_id) ON DELETE SET NULL,
    trail_id INTEGER REFERENCES trail(trail_id) ON DELETE SET NULL,
    email VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL,
    geom GEOMETRY(Point, 4326)
);