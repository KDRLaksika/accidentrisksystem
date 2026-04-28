CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE road_segments (
    segment_id INTEGER PRIMARY KEY,
    geometry GEOMETRY(LineString, 32644)
);