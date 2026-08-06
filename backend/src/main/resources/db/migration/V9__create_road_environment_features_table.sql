CREATE TABLE road_environment_features (
    environment_id BIGSERIAL PRIMARY KEY,
    segment_id BIGINT NOT NULL UNIQUE,
    junction_count INTEGER NOT NULL DEFAULT 0,
    school_count INTEGER NOT NULL DEFAULT 0,
    hospital_count INTEGER NOT NULL DEFAULT 0,
    railway_crossing_count INTEGER NOT NULL DEFAULT 0,
    bridge_count INTEGER NOT NULL DEFAULT 0,
    traffic_signal_count INTEGER NOT NULL DEFAULT 0,
    pedestrian_crossing_count INTEGER NOT NULL DEFAULT 0,
    curve_count INTEGER NOT NULL DEFAULT 0,
    straight_road_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    narrow_road_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    wide_road_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    urban_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    rural_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_road_environment_segment
        FOREIGN KEY (segment_id)
        REFERENCES road_segments(segment_id)
        ON DELETE CASCADE
);
