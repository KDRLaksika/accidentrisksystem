import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, Search, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, X } from "lucide-react";

interface SegmentRange {
  rangeId: number;
  segmentId: number;
  startKm: number;
  endKm: number;
}

interface DropdownItem {
  id: number;
  name: string;
}

interface PageResponse {
  content: SegmentRange[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const AdminSegmentRanges: React.FC = () => {
  const [ranges, setRanges] = useState<SegmentRange[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown segment list
  const [segmentsList, setSegmentsList] = useState<DropdownItem[]>([]);

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Inputs
  const [segmentId, setSegmentId] = useState("");
  const [startKm, setStartKm] = useState("");
  const [endKm, setEndKm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchRanges = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PageResponse>("/api/segment-ranges?page=0&size=1000");
      if (response.success && response.data) {
        // Sort all segment ranges by segmentId ascending
        const sorted = (response.data.content || []).sort((a, b) => a.segmentId - b.segmentId);
        setRanges(sorted);
      } else {
        setError(response.message || "Failed to load segment ranges.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading segment ranges.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await api.get<DropdownItem[]>("/api/road-segments/dropdown");
      if (response.success) {
        setSegmentsList(response.data || []);
      }
    } catch (err) {
      console.error("Unable to load road segment dropdown choices.", err);
    }
  };

  useEffect(() => {
    fetchRanges();
    fetchSegments();
  }, []);

  // Reset page if search filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const filteredRanges = ranges.filter((item) => {
    return searchTerm === "" || item.segmentId.toString().includes(searchTerm);
  });

  const totalPages = Math.ceil(filteredRanges.length / pageSize);
  const totalRecords = filteredRanges.length;

  const displayedRanges = filteredRanges.slice(
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

  const openCreateModal = () => {
    setModalMode("CREATE");
    setEditingId(null);
    setFormError(null);

    // Clear inputs
    setSegmentId("");
    setStartKm("");
    setEndKm("");

    setIsModalOpen(true);
  };

  const openEditModal = (item: SegmentRange) => {
    setModalMode("EDIT");
    setEditingId(item.rangeId);
    setFormError(null);

    // Populate inputs
    setSegmentId(item.segmentId.toString());
    setStartKm(item.startKm.toString());
    setEndKm(item.endKm.toString());

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!segmentId || !startKm || !endKm) {
      setFormError("All fields are required.");
      return;
    }

    const startVal = parseFloat(startKm);
    const endVal = parseFloat(endKm);

    if (isNaN(startVal) || isNaN(endVal) || startVal < 0 || endVal < 0) {
      setFormError("KM markers must be valid positive numbers.");
      return;
    }

    if (startVal >= endVal) {
      setFormError("Start KM must be strictly less than End KM.");
      return;
    }

    setSubmitting(true);
    const payload = {
      segmentId: parseInt(segmentId),
      startKm: startVal,
      endKm: endVal,
    };

    try {
      let response;
      if (modalMode === "CREATE") {
        response = await api.post<SegmentRange>("/api/segment-ranges", payload);
      } else {
        response = await api.put<SegmentRange>(`/api/segment-ranges/${editingId}`, payload);
      }

      if (response.success) {
        setIsModalOpen(false);
        fetchRanges();
      } else {
        setFormError(response.message || "Failed to save segment range.");
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving the range.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(null);
    try {
      const response = await api.delete<void>(`/api/segment-ranges/${id}`);
      if (response.success) {
        const newTotalRecords = totalRecords - 1;
        const newTotalPages = Math.ceil(newTotalRecords / pageSize);
        if (currentPage >= newTotalPages && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
        fetchRanges();
      } else {
        alert(response.message || "Unable to delete segment range.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred during deletion.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Segment Ranges</h1>
          <p className="text-sm text-gray-500 mt-1">Manage physical boundaries and kilometer ranges for the A2 Highway corridor segments.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Range
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Filter bar */}
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
            Total Ranges: <span className="text-brand-blue-900">{totalRecords}</span>
          </div>
        </div>

        {/* Content Table */}
        <div className="p-0 overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-gray-500 font-medium">Fetching segment ranges...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            </div>
          ) : displayedRanges.length === 0 ? (
            <div className="py-20 text-center text-gray-400 text-sm">
              No segment ranges found.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-brand-gray-50 border-b border-brand-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Range ID</th>
                  <th className="py-3 px-6">Segment ID</th>
                  <th className="py-3 px-6">Start Marker (KM)</th>
                  <th className="py-3 px-6">End Marker (KM)</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-100">
                {displayedRanges.map((item) => (
                  <tr key={item.rangeId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="py-3 px-6 font-semibold text-brand-blue-900">#{item.rangeId}</td>
                    <td className="py-3 px-6 font-bold text-gray-700">Segment {item.segmentId}</td>
                    <td className="py-3 px-6 text-gray-600">{item.startKm} km</td>
                    <td className="py-3 px-6 text-gray-600">{item.endKm} km</td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 border border-brand-gray-200 hover:border-brand-blue-800 hover:text-brand-blue-900 bg-white rounded text-gray-500 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.rangeId)}
                          className="p-1 border border-red-100 hover:border-red-200 bg-red-50 hover:bg-red-100 rounded text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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

      {/* CREATE & EDIT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />

          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xl max-w-md w-full z-50 overflow-hidden">
            <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center justify-between">
              <span className="font-bold text-brand-blue-900 text-sm">
                {modalMode === "CREATE" ? "Add Road Segment Range" : `Modify Range #${editingId}`}
              </span>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2 text-xs leading-normal">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Segment Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Road Segment</label>
                <select
                  value={segmentId}
                  onChange={(e) => setSegmentId(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-sm bg-white focus:outline-none focus:border-brand-blue-800 disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="">Select Segment...</option>
                  {segmentsList.map((seg) => (
                    <option key={seg.id} value={seg.id}>{seg.name}</option>
                  ))}
                </select>
              </div>

              {/* Start & End KM */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Start KM Marker</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="e.g. 0.0"
                    value={startKm}
                    onChange={(e) => setStartKm(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-1.5 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">End KM Marker</label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    placeholder="e.g. 1.0"
                    value={endKm}
                    onChange={(e) => setEndKm(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-1.5 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 border border-brand-gray-200 hover:bg-brand-gray-100 rounded text-xs font-semibold text-gray-700 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Save Range
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL OVERLAY */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/45" onClick={() => setDeletingId(null)} />

          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xl max-w-sm w-full z-50 overflow-hidden">
            <div className="p-4 bg-red-50 border-b border-red-100 flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="font-bold text-sm">Confirm Delete Action</span>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-600 leading-normal">
                Are you absolutely sure you want to delete segment range <span className="font-bold text-brand-blue-900">#{deletingId}</span>? This action is irreversible.
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2 border border-brand-gray-200 hover:bg-brand-gray-100 rounded text-xs font-semibold text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deletingId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                >
                  Delete Range
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSegmentRanges;
