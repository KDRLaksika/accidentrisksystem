CREATE TABLE accident_records (
    accident_id BIGSERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL,
    accident_date DATE NOT NULL,
    accident_time TIME NOT NULL,
    nearest_km_marker DOUBLE PRECISION NOT NULL,
    severity_level VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,

    CONSTRAINT fk_accident_records_road_segment
        FOREIGN KEY (segment_id)
        REFERENCES road_segments(segment_id)
);