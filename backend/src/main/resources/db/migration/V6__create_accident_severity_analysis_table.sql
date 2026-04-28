CREATE TABLE accident_severity_analysis (
    result_id BIGSERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL,
    fatal_count INTEGER NOT NULL,
    serious_count INTEGER NOT NULL,
    segment_risk_level VARCHAR(20) NOT NULL,
    generated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_accident_severity_analysis_road_segment
        FOREIGN KEY (segment_id)
        REFERENCES road_segments(segment_id)
);