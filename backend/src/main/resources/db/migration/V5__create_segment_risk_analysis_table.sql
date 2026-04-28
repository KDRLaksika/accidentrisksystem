CREATE TABLE segment_risk_analysis (
    result_id BIGSERIAL PRIMARY KEY,
    segment_id INTEGER NOT NULL,
    accident_count INTEGER NOT NULL,
    segment_risk_level VARCHAR(20) NOT NULL,
    generated_at TIMESTAMP NOT NULL,

    CONSTRAINT fk_segment_risk_analysis_road_segment
        FOREIGN KEY (segment_id)
        REFERENCES road_segments(segment_id)
);