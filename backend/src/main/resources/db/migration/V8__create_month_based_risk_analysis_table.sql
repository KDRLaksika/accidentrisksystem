CREATE TABLE month_based_risk_analysis (
    result_id BIGSERIAL PRIMARY KEY,
    month VARCHAR(30) NOT NULL,
    accident_count INTEGER NOT NULL,
    month_risk_level VARCHAR(20) NOT NULL,
    generated_at TIMESTAMP NOT NULL
);
