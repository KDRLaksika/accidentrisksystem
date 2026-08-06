import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  AlertCircle,
  Sliders,
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingDown,
  RotateCcw
} from "lucide-react";
import type { RoadEnvironmentFeaturesItem } from "./PublicRoadEnvironmentFeatures";

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

interface WhatIfResponse {
  segmentId: number;
  timeCategory: string;
  riskLevelChanged: boolean;
  primaryProbabilityDelta: number;
  baselineResult: EnvironmentRiskResponse;
  simulatedResult: EnvironmentRiskResponse;
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

const PublicWhatIfSimulation: React.FC = () => {
  const [surveyData, setSurveyData] = useState<RoadEnvironmentFeaturesItem[]>([]);
  const [segmentId, setSegmentId] = useState<number | "">("");
  const [timeCategory, setTimeCategory] = useState<string>("06:00-09:00");

  // Countermeasure Modifier State
  const [junctionCount, setJunctionCount] = useState<number>(0);
  const [schoolCount, setSchoolCount] = useState<number>(0);
  const [hospitalCount, setHospitalCount] = useState<number>(0);
  const [railwayCrossingCount, setRailwayCrossingCount] = useState<number>(0);
  const [bridgeCount, setBridgeCount] = useState<number>(0);
  const [trafficSignalCount, setTrafficSignalCount] = useState<number>(0);
  const [pedestrianCrossingCount, setPedestrianCrossingCount] = useState<number>(0);
  const [curveCount, setCurveCount] = useState<number>(0);

  const [straightRoadPercentage, setStraightRoadPercentage] = useState<number>(0);
  const [narrowRoadPercentage, setNarrowRoadPercentage] = useState<number>(0);
  const [wideRoadPercentage, setWideRoadPercentage] = useState<number>(0);
  const [urbanPercentage, setUrbanPercentage] = useState<number>(0);
  const [ruralPercentage, setRuralPercentage] = useState<number>(0);

  const [loading, setLoading] = useState(false);
  const [fetchingSurvey, setFetchingSurvey] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<WhatIfResponse | null>(null);

  // Load all survey records on mount
  useEffect(() => {
    const fetchSurveyRecords = async () => {
      setFetchingSurvey(true);
      try {
        const res = await api.get<RoadEnvironmentFeaturesItem[]>("/api/road-environment-features/all");
        if (res.success && res.data) {
          setSurveyData(res.data);
        }
      } catch (err) {
        console.error("Failed to load baseline survey records", err);
      } finally {
        setFetchingSurvey(false);
      }
    };
    fetchSurveyRecords();
  }, []);

  // When segment changes, load baseline features into modifier state
  const handleSegmentChange = (selectedId: number | "") => {
    setSegmentId(selectedId);
    setSimulationResult(null);

    if (!selectedId) return;

    const base = surveyData.find((item) => item.segmentId === selectedId);
    if (base) {
      setJunctionCount(base.junctionCount || 0);
      setSchoolCount(base.schoolCount || 0);
      setHospitalCount(base.hospitalCount || 0);
      setRailwayCrossingCount(base.railwayCrossingCount || 0);
      setBridgeCount(base.bridgeCount || 0);
      setTrafficSignalCount(base.trafficSignalCount || 0);
      setPedestrianCrossingCount(base.pedestrianCrossingCount || 0);
      setCurveCount(base.curveCount || 0);

      setStraightRoadPercentage(base.straightRoadPercentage || 0);
      setNarrowRoadPercentage(base.narrowRoadPercentage || 0);
      setWideRoadPercentage(base.wideRoadPercentage || 0);
      setUrbanPercentage(base.urbanPercentage || 0);
      setRuralPercentage(base.ruralPercentage || 0);
    }
  };

  const handleResetToBaseline = () => {
    if (segmentId) {
      handleSegmentChange(Number(segmentId));
    }
  };

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!segmentId || !timeCategory) {
      setError("Please select both a road segment and a time category slot.");
      return;
    }

    setLoading(true);
    setError(null);
    setSimulationResult(null);

    try {
      const payload = {
        segmentId: Number(segmentId),
        timeCategory,
        junctionCount,
        schoolCount,
        hospitalCount,
        railwayCrossingCount,
        bridgeCount,
        trafficSignalCount,
        pedestrianCrossingCount,
        curveCount,
        straightRoadPercentage,
        narrowRoadPercentage,
        wideRoadPercentage,
        urbanPercentage,
        ruralPercentage,
      };

      const response = await api.post<WhatIfResponse>("/api/public/environment-risk/simulate", payload);
      if (response.success && response.data) {
        setSimulationResult(response.data);
      } else {
        setError(response.message || "Failed to execute countermeasure simulation.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during simulation execution.");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
          <Sliders className="w-8 h-8 text-brand-blue-800 shrink-0" />
          What-If Countermeasure Simulator
        </h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">
          Simulate traffic engineering countermeasures (e.g. adding traffic signals, pedestrian zebra crossings, or road widening) on any segment of the A2 corridor and observe live risk reduction deltas and SHAP feature attributions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls Panel */}
        <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 lg:col-span-5 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-brand-blue-900 flex items-center gap-1.5">
              Simulation Parameters
            </h2>
            {segmentId && (
              <button
                type="button"
                onClick={handleResetToBaseline}
                className="text-xs text-brand-blue-700 hover:text-brand-blue-900 font-semibold flex items-center gap-1 underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                Reset to Baseline
              </button>
            )}
          </div>

          <form onSubmit={handleSimulate} className="space-y-4">
            {/* Segment Selector */}
            <div className="space-y-1">
              <label htmlFor="segmentId" className="block text-xs font-bold text-gray-600">
                Target Road Segment: <span className="text-red-500">*</span>
              </label>
              <select
                id="segmentId"
                value={segmentId}
                onChange={(e) => handleSegmentChange(e.target.value ? Number(e.target.value) : "")}
                disabled={loading || fetchingSurvey}
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
                Time Category Window: <span className="text-red-500">*</span>
              </label>
              <select
                id="timeCategory"
                value={timeCategory}
                onChange={(e) => setTimeCategory(e.target.value)}
                disabled={loading}
                className="w-full border border-brand-gray-200 bg-white rounded px-3 py-2 text-xs font-semibold focus:outline-none focus:border-brand-blue-600 disabled:opacity-50"
                required
              >
                {TIME_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Countermeasure Steppers / Modifiers */}
            {segmentId !== "" && (
              <div className="space-y-4 pt-3 border-t border-brand-gray-100">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Proposed Infrastructure Countermeasures
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {/* Traffic Signal Count */}
                  <div className="bg-brand-gray-50 p-2.5 rounded border border-brand-gray-200 space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600">Traffic Signals</label>
                    <input
                      type="number"
                      min={0}
                      value={trafficSignalCount}
                      onChange={(e) => setTrafficSignalCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full border border-brand-gray-300 rounded px-2 py-1 text-xs font-bold bg-white"
                    />
                  </div>

                  {/* Pedestrian Crossing Count */}
                  <div className="bg-brand-gray-50 p-2.5 rounded border border-brand-gray-200 space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600">Pedestrian Crossings</label>
                    <input
                      type="number"
                      min={0}
                      value={pedestrianCrossingCount}
                      onChange={(e) => setPedestrianCrossingCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full border border-brand-gray-300 rounded px-2 py-1 text-xs font-bold bg-white"
                    />
                  </div>

                  {/* Junction Count */}
                  <div className="bg-brand-gray-50 p-2.5 rounded border border-brand-gray-200 space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600">Junctions</label>
                    <input
                      type="number"
                      min={0}
                      value={junctionCount}
                      onChange={(e) => setJunctionCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full border border-brand-gray-300 rounded px-2 py-1 text-xs font-bold bg-white"
                    />
                  </div>

                  {/* Curve Count */}
                  <div className="bg-brand-gray-50 p-2.5 rounded border border-brand-gray-200 space-y-1">
                    <label className="block text-[11px] font-bold text-gray-600">Curves</label>
                    <input
                      type="number"
                      min={0}
                      value={curveCount}
                      onChange={(e) => setCurveCount(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full border border-brand-gray-300 rounded px-2 py-1 text-xs font-bold bg-white"
                    />
                  </div>
                </div>

                {/* Road Width Profile Sliders */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-[11px] font-bold text-gray-600 uppercase">Road Width Profile (%)</h4>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>Narrow Road Coverage</span>
                      <span>{narrowRoadPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={narrowRoadPercentage}
                      onChange={(e) => setNarrowRoadPercentage(parseFloat(e.target.value))}
                      className="w-full accent-brand-blue-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-gray-600">
                      <span>Wide Road Coverage</span>
                      <span>{wideRoadPercentage}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={wideRoadPercentage}
                      onChange={(e) => setWideRoadPercentage(parseFloat(e.target.value))}
                      className="w-full accent-brand-blue-800"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Error Banner */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-start gap-1.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !segmentId}
              className="w-full bg-brand-blue-800 hover:bg-brand-blue-900 text-white py-2.5 px-4 rounded text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Evaluating Countermeasures...
                </>
              ) : (
                "Run Countermeasure Simulation"
              )}
            </button>
          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-6">
          {/* Comparison Cards */}
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 flex flex-col justify-center items-center relative overflow-hidden">
            {loading ? (
              <div className="space-y-4 py-12 animate-pulse flex flex-col items-center">
                <div className="w-16 h-16 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-500">Simulating Risk Countermeasures & SHAP Attributions...</p>
              </div>
            ) : simulationResult ? (
              <div className="space-y-6 w-full animate-fadeIn">
                {/* Delta Risk Impact Banner */}
                <div className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-center sm:text-left bg-gradient-to-r from-brand-blue-50 to-emerald-50 border-brand-blue-200">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-900">
                      Simulation Countermeasure Impact
                    </span>
                    <div className="flex items-center gap-2 justify-center sm:justify-start">
                      <span className="text-sm font-extrabold text-gray-800">
                        {simulationResult.baselineResult.predictedRiskLevel}
                      </span>
                      <ArrowRight className="w-4 h-4 text-brand-blue-700 shrink-0" />
                      <span className="text-sm font-extrabold text-brand-blue-900">
                        {simulationResult.simulatedResult.predictedRiskLevel} Risk
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-center gap-1.5">
                    {simulationResult.riskLevelChanged ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs">
                        <TrendingDown className="w-4 h-4 mr-1" />
                        Risk Level Shifted!
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-extrabold bg-brand-blue-800 text-white shadow-xs">
                        Prob Delta: {simulationResult.primaryProbabilityDelta > 0 ? `+${simulationResult.primaryProbabilityDelta}%` : `${simulationResult.primaryProbabilityDelta}%`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Side-by-Side Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Baseline Card */}
                  <div className="p-4 rounded-md border border-brand-gray-200 bg-brand-gray-50/70 space-y-3">
                    <div className="flex justify-between items-center border-b border-brand-gray-200 pb-2">
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Current Baseline</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getRiskBadgeStyles(simulationResult.baselineResult.predictedRiskLevel)}`}>
                        {simulationResult.baselineResult.predictedRiskLevel}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs font-medium text-gray-600">
                      {Object.entries(simulationResult.baselineResult.classProbabilities || {}).map(([cls, prob]) => (
                        <div key={cls} className="flex justify-between">
                          <span>{cls} Risk:</span>
                          <span className="font-bold">{prob}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Simulated Card */}
                  <div className="p-4 rounded-md border border-brand-blue-300 bg-brand-blue-50/30 space-y-3">
                    <div className="flex justify-between items-center border-b border-brand-blue-200 pb-2">
                      <span className="text-xs font-bold text-brand-blue-900 uppercase tracking-wider">Simulated Impact</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getRiskBadgeStyles(simulationResult.simulatedResult.predictedRiskLevel)}`}>
                        {simulationResult.simulatedResult.predictedRiskLevel}
                      </span>
                    </div>
                    <div className="space-y-1.5 text-xs font-medium text-brand-blue-950">
                      {Object.entries(simulationResult.simulatedResult.classProbabilities || {}).map(([cls, prob]) => (
                        <div key={cls} className="flex justify-between">
                          <span>{cls} Risk:</span>
                          <span className="font-bold">{prob}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 space-y-2 flex flex-col items-center text-gray-400">
                <Sliders className="w-12 h-12 text-gray-300" />
                <div>
                  <h3 className="font-bold text-sm text-gray-500">Awaiting Simulation Parameters</h3>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm leading-relaxed">
                    Select a segment, adjust infrastructure modifiers (signals, crossings, road width), and click run simulation.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* SHAP Explanations Section for Simulation */}
          {simulationResult && simulationResult.simulatedResult.shapExplanations?.length > 0 && (
            <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 space-y-4">
              <div className="border-b border-brand-gray-100 pb-3">
                <h3 className="text-base font-bold text-brand-blue-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-brand-blue-800" />
                  Why did the simulated risk level change?
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  SHAP Explainable AI attribution analysis for the simulated countermeasure state.
                </p>
              </div>

              <div className="space-y-3">
                {simulationResult.simulatedResult.shapExplanations.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-brand-gray-50/70 rounded-md border border-brand-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-brand-blue-900">{item.explanation}</div>
                      <div className="text-[11px] text-gray-500">
                        Feature: <span className="font-mono text-gray-700 font-semibold">{item.feature}</span> | Simulated Value: <span className="font-bold text-brand-dark">{String(item.value)}</span>
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

export default PublicWhatIfSimulation;
