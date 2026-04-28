CREATE TABLE time_based_risk_analysis (
    result_id BIGSERIAL PRIMARY KEY,
    time_slot VARCHAR(30) NOT NULL,
    accident_count INTEGER NOT NULL,
    time_risk_level VARCHAR(20) NOT NULL,
    generated_at TIMESTAMP NOT NULL
);