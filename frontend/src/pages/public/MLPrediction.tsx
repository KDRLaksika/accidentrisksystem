import React, { useState } from "react";
import { api } from "../../services/api";
import { AlertCircle, BrainCircuit, RefreshCw, CheckCircle, ShieldAlert } from "lucide-react";

interface PredictionRequest {
  segmentId: number;
  timeCategory: string;
}

interface PredictionResponse {
  riskLevel: string;
}

const MLPrediction: React.FC = () => {
  const [segmentId, setSegmentId] = useState<number | "">("");
  const [timeCategory, setTimeCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

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
      const payload: PredictionRequest = {
        segmentId: Number(segmentId),
        timeCategory,
      };
      const response = await api.post<PredictionResponse>("/api/public/predict", payload);
      if (response.success && response.data) {
        setResult(response.data.riskLevel);
      } else {
        setError(response.message || "Failed to retrieve risk prediction.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to the prediction service.");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "LOW":
      default:
        return "bg-green-50 text-green-700 border-green-200";
    }
  };

  const getRiskDescription = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "Exercise extreme caution! Historical logs and environmental patterns suggest a high likelihood of collision occurrences in this segment during the selected time period. Maintain strict speed limits and stay vigilant.";
      case "MEDIUM":
        return "Moderate accident probability detected. Be aware of surrounding traffic behaviors, pedestrian crossings, and intersection turns. Safe driving behaviors are advised.";
      case "LOW":
      default:
        return "Low accident risk predicted. The statistical collision probability remains minimal. Drive safely and follow standard road rules.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-brand-blue-800 shrink-0" />
          Accident Risk Prediction
        </h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">
          Live machine learning accident risk predictions powered by a Random Forest Classifier trained on historical corridor logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Prediction Form Panel */}
        <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-brand-blue-900 flex items-center gap-1.5">
            Predictive Model Inputs
          </h2>
          <p className="text-xs text-gray-400">
            Specify the location segment along the A2 Panadura-Aluthgama highway and the target temporal time category to query the classifier.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Segment Selector */}
            <div className="space-y-1">
              <label htmlFor="segmentId" className="block text-xs font-bold text-gray-600">
                Road Segment:
              </label>
              <select
                id="segmentId"
                value={segmentId}
                onChange={(e) => setSegmentId(e.target.value ? Number(e.target.value) : "")}
                disabled={loading}
                className="w-full border border-brand-gray-200 bg-white rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-blue-600 disabled:opacity-50"
                required
              >
                <option value="">-- Choose Segment --</option>
                {Array.from({ length: 36 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Segment {i + 1} (KM Marker)
                  </option>
                ))}
              </select>
            </div>

            {/* Time Category Selector */}
            <div className="space-y-1">
              <label htmlFor="timeCategory" className="block text-xs font-bold text-gray-600">
                Time Category:
              </label>
              <select
                id="timeCategory"
                value={timeCategory}
                onChange={(e) => setTimeCategory(e.target.value)}
                disabled={loading}
                className="w-full border border-brand-gray-200 bg-white rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-blue-600 disabled:opacity-50"
                required
              >
                <option value="">-- Choose Time Window --</option>
                <option value="EARLY_MORNING">Early Morning (00:00 - 06:00)</option>
                <option value="MORNING">Morning (06:00 - 12:00)</option>
                <option value="DAYTIME">Daytime (12:00 - 18:00)</option>
                <option value="NIGHT">Night (18:00 - 24:00)</option>
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
                  Running ML Inference...
                </>
              ) : (
                "Predict Risk Level"
              )}
            </button>
          </form>
        </div>

        {/* Prediction Output Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Result Output Card */}
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 min-h-[260px] flex flex-col justify-center items-center text-center relative overflow-hidden">
            {loading ? (
              <div className="space-y-4 py-8 animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-2 text-center">
                  <p className="text-xs font-bold text-gray-500">Querying Model Service...</p>
                  <p className="text-[10px] text-gray-400">Classifying feature variables</p>
                </div>
              </div>
            ) : result ? (
              <div className="space-y-4 py-4 w-full flex flex-col items-center animate-fadeIn">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Prediction Completed
                </span>
                
                <div className="flex flex-col items-center gap-2">
                  <span className="text-xs font-semibold text-gray-500">Segment {segmentId} Risk Class:</span>
                  <span
                    className={`inline-flex items-center px-4 py-1.5 rounded-full text-base font-extrabold uppercase border shadow-xs ${getRiskBadgeStyles(
                      result
                    )}`}
                  >
                    {result?.toUpperCase() === "HIGH" && <ShieldAlert className="w-5 h-5 text-red-600 mr-1.5" />}
                    {result?.toUpperCase() === "MEDIUM" && <AlertCircle className="w-5 h-5 text-yellow-600 mr-1.5" />}
                    {result?.toUpperCase() === "LOW" && <CheckCircle className="w-5 h-5 text-green-600 mr-1.5" />}
                    {result} Risk
                  </span>
                </div>

                <div className="max-w-md mx-auto pt-2 border-t border-brand-gray-100 mt-2">
                  <p className="text-xs text-gray-600 font-medium leading-relaxed">
                    {getRiskDescription(result)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-12 space-y-2 flex flex-col items-center text-gray-400">
                <BrainCircuit className="w-12 h-12 text-gray-300" />
                <div>
                  <h3 className="font-bold text-sm text-gray-500">Awaiting Input Parameters</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                    Select a segment ID and temporal category slot, then click the predict button to fetch ML classifier results.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLPrediction;
