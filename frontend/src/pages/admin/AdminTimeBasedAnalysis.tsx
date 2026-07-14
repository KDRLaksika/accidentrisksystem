import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, ArrowUpDown, RefreshCw, CheckCircle, HelpCircle } from "lucide-react";

interface TimeBasedAnalysisItem {
  resultId: number;
  timeSlot: string;
  accidentCount: number;
  timeRiskLevel: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const AdminTimeBasedAnalysis: React.FC = () => {
  const [items, setItems] = useState<TimeBasedAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<"timeSlot" | "accidentCount" | "timeRiskLevel">("timeSlot");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PageResponse<TimeBasedAnalysisItem>>("/api/time-based-risk-analysis?size=100");
      if (response.success && response.data) {
        setItems(response.data.content || []);
      } else {
        setError(response.message || "Failed to load time-based risk analysis.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading analysis data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (items.length > 0) {
      setError("You have already generated Time Based Analysis");
      return;
    }
    setGenerating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await api.post<void>("/api/time-based-risk-analysis/generate", {});
      if (response.success) {
        setSuccessMessage("Time-based risk calculations generated and saved successfully!");
        await fetchAnalysisData();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.message || "Failed to generate time-based calculations.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during time-based calculations generation.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const handleSort = (field: "timeSlot" | "accidentCount" | "timeRiskLevel") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getRiskWeight = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return 3;
      case "MEDIUM":
        return 2;
      case "LOW":
      default:
        return 1;
    }
  };

  const getRiskBadgeStyles = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50";
      case "MEDIUM":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50";
      case "LOW":
      default:
        return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50";
    }
  };

  // Sort items
  const sortedItems = [...items].sort((a, b) => {
    let multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortField === "timeSlot") {
      return a.timeSlot.localeCompare(b.timeSlot) * multiplier;
    } else if (sortField === "accidentCount") {
      return (a.accidentCount - b.accidentCount) * multiplier;
    } else if (sortField === "timeRiskLevel") {
      return (getRiskWeight(a.timeRiskLevel) - getRiskWeight(b.timeRiskLevel)) * multiplier;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Time-Based Analysis</h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            Rule-based temporal accident risk classifications (Admin Management).
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchAnalysisData}
            disabled={loading || generating}
            className="px-4 py-2 border border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={handleGenerate}
            disabled={loading || generating}
            className="bg-brand-blue-800 text-white px-4 py-2 rounded text-xs font-semibold hover:bg-brand-blue-900 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
          >
            {generating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Calculating...
              </>
            ) : (
              "Generate Analysis"
            )}
          </button>
        </div>
      </div>

      {/* Toast Success */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-md flex items-center gap-2 text-xs font-medium animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Toast Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Execution Error</h4>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}


      {/* Main Table */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading temporal analysis...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No analysis results generated yet. Please click "Generate Analysis" to run calculations.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th
                    onClick={() => handleSort("timeSlot")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Time Slot
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("accidentCount")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Accident Count
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("timeRiskLevel")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Temporal Risk Level
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-100 text-xs text-brand-dark">
                {sortedItems.map((item) => (
                  <tr key={item.resultId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-brand-blue-900">
                      {item.timeSlot}
                    </td>
                    <td className="px-6 py-3.5 font-medium">
                      {item.accidentCount}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border shadow-xs tracking-wider ${getRiskBadgeStyles(item.timeRiskLevel)}`}>
                        {item.timeRiskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTimeBasedAnalysis;
