from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib

app = FastAPI(
    title="Accident Risk Prediction API"
)

model = joblib.load(
    "model/accident_risk_prediction_model.joblib"
)

VALID_TIME_CATEGORIES = [
    "Early Morning",
    "Morning",
    "Daytime",
    "Night"
]

class PredictionRequest(BaseModel):
    segment_id: int
    time_category: str

@app.get("/")
def home():
    return {
        "message": "Accident Risk Prediction API Running"
    }

@app.post("/predict")
def predict(data: PredictionRequest):

    if data.segment_id < 1 or data.segment_id > 36:
        raise HTTPException(
            status_code=400,
            detail="segment_id must be between 1 and 36"
        )

    if data.time_category not in VALID_TIME_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail="time_category must be one of: Early Morning, Morning, Daytime, Night"
        )

    input_df = pd.DataFrame([{
        "segment_id": data.segment_id,
        "time_category": data.time_category
    }])

    prediction = model.predict(input_df)

    return {
        "segment_id": data.segment_id,
        "time_category": data.time_category,
        "predicted_risk_level": prediction[0]
    }