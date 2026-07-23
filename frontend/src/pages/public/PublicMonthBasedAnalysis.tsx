import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, ArrowUpDown } from "lucide-react";

interface MonthBasedAnalysisItem {
  resultId: number;
  month: string;
  accidentCount: number;
  monthRiskLevel: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const MONTH_ORDER: { [key: string]: number } = {
  "January": 1,
  "February": 2,
  "March": 3,
  "April": 4,
  "May": 5,
  "June": 6,
  "July": 7,
  "August": 8,
  "September": 9,
  "October": 10,
  "November": 11,
  "December": 12
};

const PublicMonthBasedAnalysis: React.FC = () => {
  const [items, setItems] = useState<MonthBasedAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sorting state
  const [sortField, setSortField] = useState<"month" | "accidentCount" | "monthRiskLevel">("month");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PageResponse<MonthBasedAnalysisItem>>("/api/month-based-risk-analysis?size=100");
      if (response.success && response.data) {
        setItems(response.data.content || []);
      } else {
        setError(response.message || "Failed to load month-based risk analysis.");
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

  const handleSort = (field: "month" | "accidentCount" | "monthRiskLevel") => {
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
    if (sortField === "month") {
      const orderA = MONTH_ORDER[a.month] || 0;
      const orderB = MONTH_ORDER[b.month] || 0;
      return (orderA - orderB) * multiplier;
    } else if (sortField === "accidentCount") {
      return (a.accidentCount - b.accidentCount) * multiplier;
    } else if (sortField === "monthRiskLevel") {
      return (getRiskWeight(a.monthRiskLevel) - getRiskWeight(b.monthRiskLevel)) * multiplier;
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Month-Based Analysis</h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">
          Rule-based monthly accident risk classifications (Read-Only).
        </p>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading monthly analysis...</p>
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
            No monthly risk analysis results generated yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th
                    onClick={() => handleSort("month")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Month
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
                    onClick={() => handleSort("monthRiskLevel")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Month Risk Level
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-100 text-xs text-brand-dark">
                {sortedItems.map((item) => (
                  <tr key={item.resultId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-brand-blue-900">
                      {item.month}
                    </td>
                    <td className="px-6 py-3.5 font-medium">
                      {item.accidentCount}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border shadow-xs tracking-wider ${getRiskBadgeStyles(item.monthRiskLevel)}`}>
                        {item.monthRiskLevel}
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

export default PublicMonthBasedAnalysis;
