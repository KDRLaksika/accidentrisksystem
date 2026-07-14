import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface AccidentRecord {
  accidentId: number;
  segmentId: number;
  accidentDate: string;
  accidentTime: string;
  nearestKmMarker: number;
  severityLevel: string;
}

interface PageResponse {
  content: AccidentRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const PublicAccidentRecords: React.FC = () => {
  const [allRecords, setAllRecords] = useState<AccidentRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Client-side filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch a large size so we get all elements (e.g. 10000)
      const response = await api.get<PageResponse>("/api/accident-records?page=0&size=10000");
      if (response.success && response.data) {
        // Sort all records by accidentId ascending
        const sorted = (response.data.content || []).sort((a, b) => a.accidentId - b.accidentId);
        setAllRecords(sorted);
      } else {
        setError(response.message || "Failed to load accident records.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading accident records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // Reset to page 0 if filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, severityFilter]);

  // Client side filtering logic
  const filteredRecords = allRecords.filter((rec) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      rec.segmentId.toString() === term ||
      `segment ${rec.segmentId}`.toLowerCase() === term ||
      `segment${rec.segmentId}`.toLowerCase() === term;
      
    const matchesSeverity =
      severityFilter === "ALL" || rec.severityLevel.toUpperCase() === severityFilter.toUpperCase();

    return matchesSearch && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredRecords.length / pageSize);
  const totalRecords = filteredRecords.length;

  const displayedRecords = filteredRecords.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Accident Records</h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">Official road accident log for the Panadura–Aluthgama section (Read-Only).</p>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-xl">
            {/* Search input */}
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search by Segment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-brand-gray-200 rounded bg-white text-xs focus:outline-none focus:border-brand-blue-800"
              />
            </div>

            {/* Severity filter dropdown */}
            <div className="relative w-full sm:w-48">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Filter className="w-4 h-4" />
              </span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-brand-gray-200 rounded bg-white text-xs focus:outline-none focus:border-brand-blue-800 appearance-none cursor-pointer"
              >
                <option value="ALL">All Severities</option>
                <option value="FATAL">Fatal</option>
                <option value="SERIOUS">Serious</option>
                <option value="MINOR">Minor</option>
              </select>
            </div>
          </div>

          <div className="text-xs font-semibold text-gray-400 self-end sm:self-center">
            Total Logs: <span className="text-brand-blue-900">{totalRecords}</span>
          </div>
        </div>

        {/* Content area */}
        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-medium">Fetching records...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          ) : displayedRecords.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              No matching records found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-gray-50 border-b border-brand-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Accident ID</th>
                  <th className="py-3 px-6">Segment ID</th>
                  <th className="py-3 px-6">Date</th>
                  <th className="py-3 px-6">Time</th>
                  <th className="py-3 px-6">Km Marker</th>
                  <th className="py-3 px-6">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {displayedRecords.map((item) => (
                  <tr key={item.accidentId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="py-3 px-6 font-semibold text-brand-blue-900">#{item.accidentId}</td>
                    <td className="py-3 px-6 font-bold text-gray-700">Segment {item.segmentId}</td>
                    <td className="py-3 px-6 text-gray-600">{item.accidentDate}</td>
                    <td className="py-3 px-6 text-gray-600">{item.accidentTime}</td>
                    <td className="py-3 px-6 text-gray-600">{item.nearestKmMarker} km</td>
                    <td className="py-3 px-6">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] tracking-wider border shadow-xs ${
                          item.severityLevel.toUpperCase() === "FATAL"
                            ? "bg-red-100 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50"
                            : item.severityLevel.toUpperCase() === "SERIOUS"
                            ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/50"
                        }`}
                      >
                        {item.severityLevel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination controls */}
        {!loading && !error && totalPages > 1 && (
          <div className="p-4 bg-brand-gray-50 border-t border-brand-gray-200 flex items-center justify-between">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 0}
              className="px-3 py-1.5 border border-brand-gray-200 rounded bg-white hover:bg-brand-gray-100 text-gray-700 text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Page <span className="font-bold text-brand-blue-900">{currentPage + 1}</span> of <span className="font-bold text-brand-blue-900">{totalPages}</span>
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1.5 border border-brand-gray-200 rounded bg-white hover:bg-brand-gray-100 text-gray-700 text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicAccidentRecords;
