import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, Search, Filter, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, X } from "lucide-react";

interface AccidentRecord {
  accidentId: number;
  segmentId: number;
  accidentDate: string;
  accidentTime: string;
  nearestKmMarker: number;
  severityLevel: string;
}

interface DropdownItem {
  id: number;
  name: string;
}

interface PageResponse {
  content: AccidentRecord[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

const AdminAccidentRecords: React.FC = () => {
  const [allRecords, setAllRecords] = useState<AccidentRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown list data
  const [segmentsList, setSegmentsList] = useState<DropdownItem[]>([]);
  const [severitiesList, setSeveritiesList] = useState<DropdownItem[]>([]);

  // Search/Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form Inputs
  const [segmentId, setSegmentId] = useState("");
  const [accidentDate, setAccidentDate] = useState("");
  const [accidentTime, setAccidentTime] = useState("");
  const [nearestKmMarker, setNearestKmMarker] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<PageResponse>("/api/accident-records?page=0&size=10000");
      if (response.success && response.data) {
        // Sort all records by accidentId ascending to ensure stable order
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

  const fetchDropdowns = async () => {
    try {
      const [segRes, sevRes] = await Promise.all([
        api.get<DropdownItem[]>("/api/accident-records/dropdown/segment"),
        api.get<DropdownItem[]>("/api/accident-records/dropdown/severity")
      ]);
      if (segRes.success) setSegmentsList(segRes.data || []);
      if (sevRes.success) setSeveritiesList(sevRes.data || []);
    } catch (err) {
      console.error("Unable to load dropdown selections.", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchDropdowns();
  }, []);

  // Reset to page 0 if filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm, severityFilter]);

  // Client side search and filter
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

  const openCreateModal = () => {
    setModalMode("CREATE");
    setEditingId(null);
    setFormError(null);
    
    // Clear inputs
    setSegmentId("");
    setAccidentDate(new Date().toISOString().split("T")[0]);
    
    const now = new Date();
    setAccidentTime(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`);
    setNearestKmMarker("");
    setSeverityLevel("");
    
    setIsModalOpen(true);
  };

  const openEditModal = (item: AccidentRecord) => {
    setModalMode("EDIT");
    setEditingId(item.accidentId);
    setFormError(null);

    // Populate inputs
    setSegmentId(item.segmentId.toString());
    setAccidentDate(item.accidentDate);
    setAccidentTime(item.accidentTime.substring(0, 5));
    setNearestKmMarker(item.nearestKmMarker.toString());
    setSeverityLevel(item.severityLevel);

    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!segmentId || !accidentDate || !accidentTime || !nearestKmMarker || !severityLevel) {
      setFormError("All fields are required.");
      return;
    }

    const marker = parseFloat(nearestKmMarker);
    if (isNaN(marker) || marker < 0) {
      setFormError("Km Marker must be a valid positive number.");
      return;
    }

    setSubmitting(true);
    const formattedTime = accidentTime.length === 5 ? `${accidentTime}:00` : accidentTime;

    const payload = {
      segmentId: parseInt(segmentId),
      accidentDate,
      accidentTime: formattedTime,
      nearestKmMarker: marker,
      severityLevel,
    };

    try {
      let response;
      if (modalMode === "CREATE") {
        response = await api.post<AccidentRecord>("/api/accident-records", payload);
      } else {
        response = await api.put<AccidentRecord>(`/api/accident-records/${editingId}`, payload);
      }

      if (response.success) {
        setIsModalOpen(false);
        fetchRecords();
      } else {
        setFormError(response.message || "Failed to save accident record.");
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving the record.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(null);
    try {
      const response = await api.delete<void>(`/api/accident-records/${id}`);
      if (response.success) {
        const newTotalRecords = totalRecords - 1;
        const newTotalPages = Math.ceil(newTotalRecords / pageSize);
        if (currentPage >= newTotalPages && currentPage > 0) {
          setCurrentPage(currentPage - 1);
        }
        fetchRecords();
      } else {
        alert(response.message || "Unable to delete record.");
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
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Manage Accidents</h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">Administrative portal to insert, update, and delete road accident records.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="self-start px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-sm font-semibold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Filters bar */}
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1 max-w-xl">
            {/* Search */}
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

            {/* Severity selection */}
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

        {/* Content Table */}
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
                  <th className="py-3 px-6 text-right">Actions</th>
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
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1 border border-brand-gray-200 hover:border-brand-blue-800 hover:text-brand-blue-900 bg-white rounded text-gray-500 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.accidentId)}
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
                {modalMode === "CREATE" ? "Register New Incident Log" : `Modify Incident Log #${editingId}`}
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

              {/* Severity Dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Severity Level</label>
                <select
                  value={severityLevel}
                  onChange={(e) => setSeverityLevel(e.target.value)}
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-sm bg-white focus:outline-none focus:border-brand-blue-800 disabled:opacity-50 appearance-none cursor-pointer"
                >
                  <option value="">Select Severity...</option>
                  {severitiesList.map((sev) => (
                    <option key={sev.id} value={sev.name}>{sev.name}</option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    value={accidentDate}
                    onChange={(e) => setAccidentDate(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-1.5 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Time</label>
                  <input
                    type="time"
                    value={accidentTime}
                    onChange={(e) => setAccidentTime(e.target.value)}
                    disabled={submitting}
                    className="w-full px-3 py-1.5 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Km Marker */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nearest KM Marker</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={nearestKmMarker}
                  onChange={(e) => setNearestKmMarker(e.target.value)}
                  disabled={submitting}
                  placeholder="e.g. 14.5"
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                />
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
                  {submitting && <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Save Log
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
                Are you absolutely sure you want to delete incident record <span className="font-bold text-brand-blue-900">#{deletingId}</span>? This action is irreversible and will purge it from analysis modules.
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
                  Delete Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccidentRecords;
