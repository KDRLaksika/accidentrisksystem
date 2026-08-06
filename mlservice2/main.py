from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field


app = FastAPI(
    title="Road Environment Accident Risk Prediction API"
)


# ---------------------------------------------------------
# Model loading
# ---------------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = (
    BASE_DIR
    / "model"
    / "road_environment_risk_prediction_model.joblib"
)


try:
    model = joblib.load(MODEL_PATH)

except FileNotFoundError as exc:
    raise RuntimeError(
        f"Model file was not found at: {MODEL_PATH}"
    ) from exc

except Exception as exc:
    raise RuntimeError(
        f"Failed to load the prediction model: {exc}"
    ) from exc


# Extract the fitted components from the pipeline
preprocessor = model.named_steps["preprocessor"]
classifier = model.named_steps["classifier"]

# Names after StandardScaler and OneHotEncoder transformation
transformed_feature_names = (
    preprocessor.get_feature_names_out()
)

# Create SHAP explainer once when the API starts
shap_explainer = shap.TreeExplainer(classifier)


VALID_TIME_CATEGORIES = [
    "00:00-03:00",
    "03:00-06:00",
    "06:00-09:00",
    "09:00-12:00",
    "12:00-15:00",
    "15:00-18:00",
    "18:00-21:00",
    "21:00-00:00"
]


# ---------------------------------------------------------
# Request model
# ---------------------------------------------------------

class PredictionRequest(BaseModel):

    # Application identifier only.
    # It is not passed into the ML model.
    segment_id: int = Field(ge=1, le=36)

    time_category: str

    school_time: int = Field(ge=0, le=1)
    work_rush: int = Field(ge=0, le=1)

    junction_count: int = Field(ge=0)
    school_count: int = Field(ge=0)
    hospital_count: int = Field(ge=0)
    railway_crossing_count: int = Field(ge=0)
    bridge_count: int = Field(ge=0)
    traffic_signal_count: int = Field(ge=0)
    pedestrian_crossing_count: int = Field(ge=0)
    curve_count: int = Field(ge=0)

    straight_road_percentage: float = Field(
        ge=0,
        le=100
    )

    narrow_road_percentage: float = Field(
        ge=0,
        le=100
    )

    wide_road_percentage: float = Field(
        ge=0,
        le=100
    )

    urban_percentage: float = Field(
        ge=0,
        le=100
    )

    rural_percentage: float = Field(
        ge=0,
        le=100
    )


# ---------------------------------------------------------
# Helper functions
# ---------------------------------------------------------

def clean_feature_name(
    transformed_name: str
) -> str:
    """
    Convert names produced by ColumnTransformer into
    readable original feature names.
    """

    if transformed_name.startswith(
        "num__"
    ):
        return transformed_name.replace(
            "num__",
            "",
            1
        )

    if transformed_name.startswith(
        "cat__time_category_"
    ):
        return "time_category"

    if transformed_name.startswith(
        "cat__"
    ):
        return transformed_name.replace(
            "cat__",
            "",
            1
        )

    return transformed_name


def get_original_feature_value(
    feature_name: str,
    data: PredictionRequest
):
    """
    Return the original, unscaled value that was supplied
    for a feature.
    """

    if feature_name == "time_category":
        return data.time_category

    return getattr(
        data,
        feature_name,
        None
    )


def create_explanation_message(
    feature_name: str,
    feature_value,
    predicted_class: str
) -> str:
    """
    Convert a SHAP feature contribution into a readable
    explanation for the road user.
    """

    readable_names = {
        "time_category": "selected time category",
        "school_time": "school-time activity",
        "work_rush": "work-rush activity",
        "junction_count": "road junctions",
        "school_count": "nearby schools",
        "hospital_count": "nearby hospitals",
        "railway_crossing_count": "railway crossings",
        "bridge_count": "bridges",
        "traffic_signal_count": "traffic signals",
        "pedestrian_crossing_count":
            "pedestrian crossings",
        "curve_count": "road curves",
        "straight_road_percentage":
            "straight-road coverage",
        "narrow_road_percentage":
            "narrow-road coverage",
        "wide_road_percentage":
            "wide-road coverage",
        "urban_percentage":
            "urban-area coverage",
        "rural_percentage":
            "rural-area coverage"
    }

    readable_feature = readable_names.get(
        feature_name,
        feature_name.replace("_", " ")
    )

    if feature_name == "time_category":
        return (
            f"The selected time category "
            f"({feature_value}) contributed to the "
            f"{predicted_class} risk prediction."
        )

    if feature_name == "school_time":
        status = (
            "a school-time period"
            if feature_value == 1
            else "not a school-time period"
        )

        return (
            f"The selected period is {status}, which "
            f"contributed to the {predicted_class} "
            f"risk prediction."
        )

    if feature_name == "work_rush":
        status = (
            "a work-rush period"
            if feature_value == 1
            else "not a work-rush period"
        )

        return (
            f"The selected period is {status}, which "
            f"contributed to the {predicted_class} "
            f"risk prediction."
        )

    if "percentage" in feature_name:
        return (
            f"The segment has {feature_value}% "
            f"{readable_feature}, which the model "
            f"associated with the {predicted_class} "
            f"risk prediction."
        )

    return (
        f"The segment contains {feature_value} "
        f"{readable_feature}, which the model "
        f"associated with the {predicted_class} "
        f"risk prediction."
    )


def generate_shap_explanations(
    input_df: pd.DataFrame,
    data: PredictionRequest,
    predicted_class: str,
    top_n: int = 5
) -> list[dict]:
    """
    Generate local SHAP explanations for one prediction.
    """

    # Apply exactly the same preprocessing used in training
    transformed_input = preprocessor.transform(
        input_df
    )

    # SHAP works more reliably here with a dense array
    if hasattr(
        transformed_input,
        "toarray"
    ):
        transformed_input = (
            transformed_input.toarray()
        )

    transformed_input = np.asarray(
        transformed_input
    )

    shap_values = shap_explainer.shap_values(
        transformed_input
    )

    classes = list(classifier.classes_)

    predicted_class_index = classes.index(
        predicted_class
    )

    # SHAP 0.45+ commonly returns:
    # (samples, features, classes)
    if isinstance(shap_values, np.ndarray):

        if shap_values.ndim == 3:
            selected_shap_values = shap_values[
                0,
                :,
                predicted_class_index
            ]

        elif shap_values.ndim == 2:
            selected_shap_values = shap_values[0]

        else:
            raise ValueError(
                "Unexpected SHAP value dimensions."
            )

    # Compatibility with older SHAP versions
    elif isinstance(shap_values, list):
        selected_shap_values = shap_values[
            predicted_class_index
        ][0]

    else:
        raise ValueError(
            "Unsupported SHAP result format."
        )

    explanation_items = []

    for index, shap_value in enumerate(
        selected_shap_values
    ):
        transformed_name = str(
            transformed_feature_names[index]
        )

        clean_name = clean_feature_name(
            transformed_name
        )

        transformed_value = transformed_input[
            0,
            index
        ]

        # Ignore inactive one-hot encoded time categories
        if (
            transformed_name.startswith(
                "cat__time_category_"
            )
            and transformed_value == 0
        ):
            continue

        original_value = get_original_feature_value(
            clean_name,
            data
        )

        explanation_items.append({
            "feature": clean_name,
            "value": original_value,
            "shap_value": round(
                float(shap_value),
                6
            )
        })

    # Positive values push the prediction toward the
    # selected predicted class.
    positive_items = [
        item
        for item in explanation_items
        if item["shap_value"] > 0
    ]

    positive_items.sort(
        key=lambda item: item["shap_value"],
        reverse=True
    )

    selected_items = positive_items[:top_n]

    # Fallback in case no positive values are available
    if not selected_items:
        explanation_items.sort(
            key=lambda item: abs(
                item["shap_value"]
            ),
            reverse=True
        )

        selected_items = explanation_items[:top_n]

    for item in selected_items:
        item["explanation"] = (
            create_explanation_message(
                item["feature"],
                item["value"],
                predicted_class
            )
        )

    return selected_items


# ---------------------------------------------------------
# Endpoints
# ---------------------------------------------------------

@app.get("/")
def home():
    return {
        "message": (
            "Road Environment Accident Risk "
            "Prediction API Running"
        )
    }


@app.get("/health")
def health():
    return {
        "status": "UP",
        "model_loaded": True,
        "shap_loaded": True,
        "model_file": MODEL_PATH.name
    }


@app.post("/predict")
def predict(data: PredictionRequest):

    if (
        data.time_category
        not in VALID_TIME_CATEGORIES
    ):
        raise HTTPException(
            status_code=400,
            detail=(
                "time_category must be one of: "
                + ", ".join(
                    VALID_TIME_CATEGORIES
                )
            )
        )

    input_df = pd.DataFrame([{
        "time_category":
            data.time_category,

        "school_time":
            data.school_time,

        "work_rush":
            data.work_rush,

        "junction_count":
            data.junction_count,

        "school_count":
            data.school_count,

        "hospital_count":
            data.hospital_count,

        "railway_crossing_count":
            data.railway_crossing_count,

        "bridge_count":
            data.bridge_count,

        "traffic_signal_count":
            data.traffic_signal_count,

        "pedestrian_crossing_count":
            data.pedestrian_crossing_count,

        "curve_count":
            data.curve_count,

        "straight_road_percentage":
            data.straight_road_percentage,

        "narrow_road_percentage":
            data.narrow_road_percentage,

        "wide_road_percentage":
            data.wide_road_percentage,

        "urban_percentage":
            data.urban_percentage,

        "rural_percentage":
            data.rural_percentage
    }])

    try:
        prediction = model.predict(
            input_df
        )[0]

        probabilities = model.predict_proba(
            input_df
        )[0]

        classes = classifier.classes_

        class_probabilities = {
            str(risk_class): round(
                float(probability) * 100,
                2
            )
            for risk_class, probability in zip(
                classes,
                probabilities
            )
        }

        shap_explanations = (
            generate_shap_explanations(
                input_df=input_df,
                data=data,
                predicted_class=str(prediction),
                top_n=5
            )
        )

        return {
            "segment_id":
                data.segment_id,

            "time_category":
                data.time_category,

            "predicted_risk_level":
                str(prediction),

            "class_probabilities":
                class_probabilities,

            "shap_explanations":
                shap_explanations
        }

    except HTTPException:
        raise

    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {exc}"
        ) from exc