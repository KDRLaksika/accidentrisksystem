import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, ArrowUpDown, HelpCircle } from "lucide-react";

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

const PublicTimeBasedAnalysis: React.FC = () => {
  const [items, setItems] = useState<TimeBasedAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        return "bg-red-50 text-red-700 border-red-200";
      case "MEDIUM":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "LOW":
      default:
        return "bg-green-50 text-green-700 border-green-200";
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
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Time-Based Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">
          Rule-based temporal accident risk classifications (Read-Only).
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-brand-blue-50 border border-brand-blue-100 rounded-lg p-4 flex gap-3 text-xs text-brand-blue-900 leading-relaxed">
        <HelpCircle className="w-5 h-5 text-brand-blue-800 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-1">About Time-Based Risk Calculations</h4>
          <p>
            Time-Based Risk levels are determined by parsing the hour of each accident and grouping them into temporal slots: 
            <strong>Morning</strong> (06:00 to 12:00), <strong>Daytime</strong> (12:00 to 18:00), and <strong>Night</strong> (18:00 to 06:00). 
            Risk classifications are based on aggregate accident frequencies in those windows: <strong>High Risk</strong> (&gt;= 150 accidents), 
            <strong>Medium Risk</strong> (50 to 149 accidents), and <strong>Low Risk</strong> (&lt; 50 accidents).
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading temporal analysis...</p>
          </div>
        ) : error ? (
          <div className="p-8 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal max-w-md">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Fetch Error</h4>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No temporal analysis results generated yet.
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
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getRiskBadgeStyles(item.timeRiskLevel)}`}>
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

export default PublicTimeBasedAnalysis;
