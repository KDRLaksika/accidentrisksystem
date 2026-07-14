import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, Search, ChevronLeft, ChevronRight } from "lucide-react";

interface RoadSegment {
  segmentId: number;
  geometry: string;
}

interface PageResponse {
  content: RoadSegment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const AdminRoadSegments: React.FC = () => {
  const [segments, setSegments] = useState<RoadSegment[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSegments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch size=100 to capture all 36 segments in one call
      const response = await api.get<PageResponse>("/api/road-segments?page=0&size=100");
      if (response.success && response.data) {
        const sorted = (response.data.content || []).sort((a, b) => a.segmentId - b.segmentId);
        setSegments(sorted);
      } else {
        setError(response.message || "Failed to load road segments.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading road segments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSegments();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const filteredSegments = segments.filter((seg) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      searchTerm === "" ||
      seg.segmentId.toString() === term ||
      `segment ${seg.segmentId}`.toLowerCase() === term ||
      `segment${seg.segmentId}`.toLowerCase() === term
    );
  });

  const totalPages = Math.ceil(filteredSegments.length / pageSize);
  const totalRecords = filteredSegments.length;

  const displayedSegments = filteredSegments.slice(
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
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Road Segments</h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">Detailed list of 36 geographical road segments loaded from PostGIS (Read-Only).</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
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
          <div className="text-xs font-semibold text-gray-400">
            Total Segments: <span className="text-brand-blue-900">{totalRecords}</span>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-medium">Fetching segments...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          ) : displayedSegments.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              No matching segment records found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-gray-50 border-b border-brand-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-6 w-32">Segment ID</th>
                  <th className="py-3 px-6">Geometry (LineString - WKT representation)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {displayedSegments.map((item) => (
                  <tr key={item.segmentId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="py-3 px-6 font-bold text-brand-blue-900">Segment {item.segmentId}</td>
                    <td className="py-3 px-6 font-mono text-gray-500 max-w-lg truncate select-all cursor-text" title={item.geometry}>
                      {item.geometry}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
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

export default AdminRoadSegments;
