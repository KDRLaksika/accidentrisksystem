import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Search, AlertCircle, ArrowUpDown, RefreshCw, CheckCircle, HelpCircle } from "lucide-react";

interface SeverityAnalysisItem {
  resultId: number;
  segmentId: number;
  fatalCount: number;
  seriousCount: number;
  segmentRiskLevel: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const AdminSeverityAnalysis: React.FC = () => {
  const [items, setItems] = useState<SeverityAnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Search & Filter state
  const [searchSegment, setSearchSegment] = useState("");
  const [riskFilter, setRiskFilter] = useState("ALL");

  // Sorting state
  const [sortField, setSortField] = useState<"segmentId" | "fatalCount" | "seriousCount" | "segmentRiskLevel">("segmentId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAnalysisData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PageResponse<SeverityAnalysisItem>>("/api/accident-severity-analysis?size=100");
      if (response.success && response.data) {
        setItems(response.data.content || []);
      } else {
        setError(response.message || "Failed to load accident severity analysis.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading analysis data.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await api.post<void>("/api/accident-severity-analysis/generate", {});
      if (response.success) {
        setSuccessMessage("Accident severity calculations generated and saved successfully!");
        await fetchAnalysisData();
        setTimeout(() => setSuccessMessage(null), 5000);
      } else {
        setError(response.message || "Failed to generate severity calculations.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during severity calculations generation.");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  const handleSort = (field: "segmentId" | "fatalCount" | "seriousCount" | "segmentRiskLevel") => {
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

  // 1. Filter items
  const filteredItems = items.filter((item) => {
    const matchesSegment = item.segmentId.toString().includes(searchSegment.trim());
    const matchesRisk = riskFilter === "ALL" || item.segmentRiskLevel?.toUpperCase() === riskFilter;
    return matchesSegment && matchesRisk;
  });

  // 2. Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    let multiplier = sortDirection === "asc" ? 1 : -1;
    if (sortField === "segmentId" || sortField === "fatalCount" || sortField === "seriousCount") {
      return (a[sortField] - b[sortField]) * multiplier;
    } else if (sortField === "segmentRiskLevel") {
      return (getRiskWeight(a.segmentRiskLevel) - getRiskWeight(b.segmentRiskLevel)) * multiplier;
    }
    return 0;
  });

  // 3. Paginate items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchSegment, riskFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Severity Analysis</h1>
          <p className="text-sm text-gray-500 mt-1">
            Rule-based serious and fatal accident statistics aggregated by road segment (Admin Management).
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

      {/* Info Card */}
      <div className="bg-brand-blue-50 border border-brand-blue-100 rounded-lg p-4 flex gap-3 text-xs text-brand-blue-900 leading-relaxed">
        <HelpCircle className="w-5 h-5 text-brand-blue-800 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold mb-1">Administrative Note</h4>
          <p>
            Generating Accident Severity calculations triggers the rule-based aggregation of fatal and serious accidents across each segment. 
            This dynamically re-allocates segment severity risks and updates charts and interactive maps instantly.
          </p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-brand-gray-200 bg-brand-gray-50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Segment ID..."
              value={searchSegment}
              onChange={(e) => setSearchSegment(e.target.value)}
              className="pl-9 pr-4 py-2 w-full border border-brand-gray-200 rounded text-xs bg-white focus:outline-none focus:border-brand-blue-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-600 shrink-0">Severity Risk:</span>
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="border border-brand-gray-200 bg-white rounded px-2 py-2 text-xs font-medium focus:outline-none focus:border-brand-blue-600"
            >
              <option value="ALL">All Levels</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading severity analysis...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No analysis results match the selected filters. Please trigger "Generate Analysis" if data is missing.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200">
              <thead className="bg-brand-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th
                    onClick={() => handleSort("segmentId")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Segment ID
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("fatalCount")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Fatal Count
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("seriousCount")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Serious Count
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort("segmentRiskLevel")}
                    className="px-6 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Severity Risk Level
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-100 text-xs text-brand-dark">
                {currentItems.map((item) => (
                  <tr key={item.resultId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="px-6 py-3 font-semibold text-brand-blue-900">
                      Segment {item.segmentId}
                    </td>
                    <td className="px-6 py-3 font-medium text-red-600">
                      {item.fatalCount}
                    </td>
                    <td className="px-6 py-3 font-medium text-orange-600">
                      {item.seriousCount}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-extrabold uppercase border ${getRiskBadgeStyles(item.segmentRiskLevel)}`}>
                        {item.segmentRiskLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-brand-gray-200 bg-brand-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-semibold text-gray-500">
                  Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedItems.length)} of {sortedItems.length} segments
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 border border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white rounded text-[10px] font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-2.5 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer border ${
                        currentPage === index + 1
                          ? "bg-brand-blue-800 border-brand-blue-800 text-white"
                          : "border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white"
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 border border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white rounded text-[10px] font-semibold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSeverityAnalysis;
