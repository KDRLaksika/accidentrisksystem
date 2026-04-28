CREATE TABLE segment_ranges (
    range_id BIGSERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL,
    start_km DOUBLE PRECISION NOT NULL,
    end_km DOUBLE PRECISION NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT fk_segment_ranges_road_segment
        FOREIGN KEY (segment_id)
        REFERENCES road_segments(segment_id)
);