import React, { useState } from "react";
import { api } from "../../services/api";
import { AlertCircle, Brain, RefreshCw, CheckCircle, ShieldAlert, Sparkles } from "lucide-react";

interface EnvironmentRiskRequest {
  segmentId: number;
  timeCategory: string;
}

interface ShapExplanation {
  feature: string;
  value: any;
  shapValue: number;
  explanation: string;
}

interface EnvironmentRiskResponse {
  segmentId: number;
  timeCategory: string;
  predictedRiskLevel: string;
  classProbabilities: { [key: string]: number };
  shapExplanations: ShapExplanation[];
}

const TIME_CATEGORIES = [
  { value: "00:00-03:00", label: "00:00 - 03:00 (Late Night)" },
  { value: "03:00-06:00", label: "03:00 - 06:00 (Early Morning)" },
  { value: "06:00-09:00", label: "06:00 - 09:00 (Morning Rush / School Time)" },
  { value: "09:00-12:00", label: "09:00 - 12:00 (Mid-Morning)" },
  { value: "12:00-15:00", label: "12:00 - 15:00 (Afternoon / School Close)" },
  { value: "15:00-18:00", label: "15:00 - 18:00 (Late Afternoon Rush)" },
  { value: "18:00-21:00", label: "18:00 - 21:00 (Evening Rush)" },
  { value: "21:00-00:00", label: "21:00 - 00:00 (Night)" },
];

const PublicEnvironmentRiskPrediction: React.FC = () => {
  const [segmentId, setSegmentId] = useState<number | "">("");
  const [timeCategory, setTimeCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<EnvironmentRiskResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmentId || !timeCategory) {
      setError("Please select both a road segment and a time category.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload: EnvironmentRiskRequest = {
        segmentId: Number(segmentId),
        timeCategory,
      };
      const response = await api.post<EnvironmentRiskResponse>("/api/public/environment-risk/predict", payload);
      if (response.success && response.data) {
        setResult(response.data);
      } else {
        setError(response.message || "Failed to retrieve environment risk prediction.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to the environment risk prediction service.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-900";
      case "MEDIUM":
        return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-900";
      case "LOW":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-900";
    }
  };

  const getRiskBarColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-amber-500";
      case "LOW":
      default:
        return "bg-emerald-500";
    }
  };

  const getRiskDescription = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "High accident risk predicted for this road segment during the selected time period based on road environment characteristics (POIs, crossings, curves, road width, and land use). Drivers should exercise high caution.";
      case "MEDIUM":
        return "Moderate accident risk predicted. Complex road environment features and temporal activity suggest heightened risk. Drive carefully and obey traffic signals.";
      case "LOW":
      default:
        return "Low accident risk predicted. Environmental risk factors and traffic rush indicators remain low for this segment and time window.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
          <Brain className="w-8 h-8 text-brand-blue-800 shrink-0" />
          Accident Environment Risk Prediction
        </h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">
          Machine Learning accident risk prediction integrating survey environment characteristics (junctions, schools, hospitals, crossings, curves, road width, land use) and time windows with SHAP Explainable AI explanations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Form Input Card */}
        <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-brand-blue-900 flex items-center gap-1.5">
            Prediction Parameters
          </h2>
          <p className="text-xs text-gray-400">
            Select a target road segment (1–36) and time category window. Road environment characteristics stored from field survey logs will be automatically injected into the model.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Segment Selector */}
            <div className="space-y-1">
              <label htmlFor="segmentId" className="block text-xs font-bold text-gray-600">
                Road Segment: <span className="text-red-500">*</span>
              </label>
              <select
                id="segmentId"
                value={segmentId}
                onChange={(e) => setSegmentId(e.target.value ? Number(e.target.value) : "")}
                disabled={loading}
                className="w-full border border-brand-gray-200 bg-white rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-blue-600 disabled:opacity-50"
                required
              >
                <option value="">-- Choose Segment (1 to 36) --</option>
                {Array.from({ length: 36 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Segment {i + 1} (A2 Highway)
                  </option>
                ))}
              </select>
            </div>

            {/* Time Category Selector */}
            <div className="space-y-1">
              <label htmlFor="timeCategory" className="block text-xs font-bold text-gray-600">
                Time Category Slot: <span className="text-red-500">*</span>
              </label>
              <select
                id="timeCategory"
                value={timeCategory}
                onChange={(e) => setTimeCategory(e.target.value)}
                disabled={loading}
                className="w-full border border-brand-gray-200 bg-white rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-blue-600 disabled:opacity-50"
                required
              >
                <option value="">-- Select 3-Hour Time Category --</option>
                {TIME_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-start gap-1.5 leading-normal">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue-800 hover:bg-brand-blue-900 text-white py-2.5 px-4 rounded text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Evaluating Environment Model...
                </>
              ) : (
                "Predict Risk Level"
              )}
            </button>
          </form>
        </div>

        {/* Results Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Risk Level Result Card */}
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 flex flex-col justify-center items-center text-center relative overflow-hidden">
            {loading ? (
              <div className="space-y-4 py-12 animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-2 text-center">
                  <p className="text-xs font-bold text-gray-500">Retrieving Road Environment Features...</p>
                  <p className="text-[10px] text-gray-400">Computing SHAP Feature Attributions</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-6 py-2 w-full animate-fadeIn">
                {/* Status & Badge */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Environment Model Prediction
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-gray-500">Segment {result.segmentId} ({result.timeCategory}):</span>
                    <span
                      className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-extrabold uppercase border shadow-xs ${getRiskBadgeStyles(
                        result.predictedRiskLevel
                      )}`}
                    >
                      {result.predictedRiskLevel?.toUpperCase() === "HIGH" && <ShieldAlert className="w-5 h-5 text-red-600 mr-1.5" />}
                      {result.predictedRiskLevel?.toUpperCase() === "MEDIUM" && <AlertCircle className="w-5 h-5 text-amber-600 mr-1.5" />}
                      {result.predictedRiskLevel?.toUpperCase() === "LOW" && <CheckCircle className="w-5 h-5 text-emerald-600 mr-1.5" />}
                      {result.predictedRiskLevel} Risk
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 font-medium max-w-md mx-auto leading-relaxed pt-1">
                    {getRiskDescription(result.predictedRiskLevel)}
                  </p>
                </div>

                {/* Class Probabilities */}
                {result.classProbabilities && Object.keys(result.classProbabilities).length > 0 && (
                  <div className="pt-4 border-t border-brand-gray-100 space-y-2 text-left">
                    <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-brand-blue-800" />
                      Class Probabilities
                    </h4>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(result.classProbabilities).map(([riskClass, prob]) => (
                        <div key={riskClass} className="bg-brand-gray-50 p-2.5 rounded border border-brand-gray-200">
                          <div className="flex justify-between items-center text-xs font-bold text-gray-600 mb-1">
                            <span>{riskClass}</span>
                            <span>{prob.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-brand-gray-200 h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getRiskBarColor(riskClass)} transition-all duration-500`}
                              style={{ width: `${Math.min(Math.max(prob, 0), 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 space-y-2 flex flex-col items-center text-gray-400">
                <Brain className="w-12 h-12 text-gray-300" />
                <div>
                  <h3 className="font-bold text-sm text-gray-500">Awaiting Prediction Request</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                    Select a road segment ID and time category to query the Road Environment ML Model and view SHAP explanations.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SHAP Explanations Section */}
          {result && result.shapExplanations && result.shapExplanations.length > 0 && (
            <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 space-y-4">
              <div className="border-b border-brand-gray-100 pb-3">
                <h3 className="text-base font-bold text-brand-blue-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-blue-800" />
                  Why was this risk level predicted?
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  SHAP (SHapley Additive exPlanations) key feature contribution analysis identifying top environmental drivers.
                </p>
              </div>

              <div className="space-y-3">
                {result.shapExplanations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-brand-gray-50/70 rounded-md border border-brand-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-bold text-brand-blue-900">
                        <span>{item.explanation}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Feature: <span className="font-mono text-gray-700 font-semibold">{item.feature}</span> | Recorded Value: <span className="font-bold text-brand-dark">{String(item.value)}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className={`inline-block px-2.5 py-1 rounded text-[11px] font-mono font-extrabold border ${
                        item.shapValue > 0
                          ? "bg-amber-50 text-amber-800 border-amber-200"
                          : "bg-blue-50 text-blue-800 border-blue-200"
                      }`}>
                        SHAP: {item.shapValue > 0 ? `+${item.shapValue.toFixed(4)}` : item.shapValue.toFixed(4)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicEnvironmentRiskPrediction;
