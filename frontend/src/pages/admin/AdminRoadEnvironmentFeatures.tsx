import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, Search, Plus, Edit2, Trash2, X, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import type { RoadEnvironmentFeaturesItem } from "../public/PublicRoadEnvironmentFeatures";

interface DropdownItem {
  id: number;
  name: string;
}

const AdminRoadEnvironmentFeatures: React.FC = () => {
  const [items, setItems] = useState<RoadEnvironmentFeaturesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination & Filtering
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");

  // Dropdown list for segment selection
  const [segmentsList, setSegmentsList] = useState<DropdownItem[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"CREATE" | "EDIT">("CREATE");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [segmentId, setSegmentId] = useState<string>("");
  const [junctionCount, setJunctionCount] = useState<string>("0");
  const [schoolCount, setSchoolCount] = useState<string>("0");
  const [hospitalCount, setHospitalCount] = useState<string>("0");
  const [railwayCrossingCount, setRailwayCrossingCount] = useState<string>("0");
  const [bridgeCount, setBridgeCount] = useState<string>("0");
  const [trafficSignalCount, setTrafficSignalCount] = useState<string>("0");
  const [pedestrianCrossingCount, setPedestrianCrossingCount] = useState<string>("0");
  const [curveCount, setCurveCount] = useState<string>("0");
  const [straightRoadPercentage, setStraightRoadPercentage] = useState<string>("0.00");
  const [narrowRoadPercentage, setNarrowRoadPercentage] = useState<string>("0.00");
  const [wideRoadPercentage, setWideRoadPercentage] = useState<string>("0.00");
  const [urbanPercentage, setUrbanPercentage] = useState<string>("0.00");
  const [ruralPercentage, setRuralPercentage] = useState<string>("0.00");

  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RoadEnvironmentFeaturesItem[]>("/api/road-environment-features/all");
      if (response.success && response.data) {
        const sorted = [...response.data].sort((a, b) => a.segmentId - b.segmentId);
        setItems(sorted);
      } else {
        setError(response.message || "Failed to load road environment features.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading environment data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSegments = async () => {
    try {
      const response = await api.get<DropdownItem[]>("/api/road-segments/dropdown");
      if (response.success && response.data) {
        setSegmentsList(response.data);
      }
    } catch (err) {
      console.error("Unable to load segment dropdown", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchSegments();
  }, []);

  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  const filteredItems = items.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      searchTerm === "" ||
      item.segmentId.toString() === term ||
      `segment ${item.segmentId}`.toLowerCase().includes(term) ||
      `segment${item.segmentId}`.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredItems.length / pageSize);
  const displayedItems = filteredItems.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const resetForm = () => {
    setSegmentId("");
    setJunctionCount("0");
    setSchoolCount("0");
    setHospitalCount("0");
    setRailwayCrossingCount("0");
    setBridgeCount("0");
    setTrafficSignalCount("0");
    setPedestrianCrossingCount("0");
    setCurveCount("0");
    setStraightRoadPercentage("0.00");
    setNarrowRoadPercentage("0.00");
    setWideRoadPercentage("0.00");
    setUrbanPercentage("0.00");
    setRuralPercentage("0.00");
    setFormError(null);
  };

  const handleOpenCreateModal = () => {
    resetForm();
    setModalMode("CREATE");
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: RoadEnvironmentFeaturesItem) => {
    resetForm();
    setModalMode("EDIT");
    setEditingId(item.environmentId);
    setSegmentId(item.segmentId.toString());
    setJunctionCount(item.junctionCount.toString());
    setSchoolCount(item.schoolCount.toString());
    setHospitalCount(item.hospitalCount.toString());
    setRailwayCrossingCount(item.railwayCrossingCount.toString());
    setBridgeCount(item.bridgeCount.toString());
    setTrafficSignalCount(item.trafficSignalCount.toString());
    setPedestrianCrossingCount(item.pedestrianCrossingCount.toString());
    setCurveCount(item.curveCount.toString());
    setStraightRoadPercentage(item.straightRoadPercentage.toString());
    setNarrowRoadPercentage(item.narrowRoadPercentage.toString());
    setWideRoadPercentage(item.wideRoadPercentage.toString());
    setUrbanPercentage(item.urbanPercentage.toString());
    setRuralPercentage(item.ruralPercentage.toString());
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!segmentId) {
      setFormError("Please select a road segment.");
      return;
    }

    setSubmitting(true);
    const payload = {
      segmentId: Number(segmentId),
      junctionCount: Number(junctionCount) || 0,
      schoolCount: Number(schoolCount) || 0,
      hospitalCount: Number(hospitalCount) || 0,
      railwayCrossingCount: Number(railwayCrossingCount) || 0,
      bridgeCount: Number(bridgeCount) || 0,
      trafficSignalCount: Number(trafficSignalCount) || 0,
      pedestrianCrossingCount: Number(pedestrianCrossingCount) || 0,
      curveCount: Number(curveCount) || 0,
      straightRoadPercentage: Number(straightRoadPercentage) || 0,
      narrowRoadPercentage: Number(narrowRoadPercentage) || 0,
      wideRoadPercentage: Number(wideRoadPercentage) || 0,
      urbanPercentage: Number(urbanPercentage) || 0,
      ruralPercentage: Number(ruralPercentage) || 0,
    };

    try {
      if (modalMode === "CREATE") {
        const response = await api.post("/api/road-environment-features", payload);
        if (response.success) {
          setIsModalOpen(false);
          fetchItems();
        } else {
          setFormError(response.message || "Failed to create road environment feature record.");
        }
      } else if (editingId !== null) {
        const response = await api.put(`/api/road-environment-features/${editingId}`, payload);
        if (response.success) {
          setIsModalOpen(false);
          fetchItems();
        } else {
          setFormError(response.message || "Failed to update road environment feature record.");
        }
      }
    } catch (err: any) {
      setFormError(err.message || "An error occurred while saving.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await api.delete(`/api/road-environment-features/${id}`);
      if (response.success) {
        setDeletingId(null);
        fetchItems();
      } else {
        alert(response.message || "Failed to delete record.");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while deleting record.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
            <Layers className="w-8 h-8 text-brand-blue-800 shrink-0" />
            Road Environment Features Management
          </h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            Maintain field survey features and environmental characteristics for A2 highway segments.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-4 py-2.5 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded-md text-xs font-bold shadow-xs flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Feature Record
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Search */}
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center justify-between gap-4">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Segment ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-brand-gray-200 rounded bg-white text-xs focus:outline-none focus:border-brand-blue-800"
            />
          </div>
          <div className="text-xs font-semibold text-gray-400">
            Total Records: <span className="text-brand-blue-900 font-bold">{filteredItems.length}</span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading road environment features...</p>
          </div>
        ) : error ? (
          <div className="p-8 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal max-w-md">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            No road environment feature records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200 text-xs">
              <thead className="bg-brand-gray-50 font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5 text-left">Segment ID</th>
                  <th className="px-4 py-3.5 text-left">POIs & Infrastructure</th>
                  <th className="px-4 py-3.5 text-left">Crossings & Signals</th>
                  <th className="px-4 py-3.5 text-left">Geometry</th>
                  <th className="px-4 py-3.5 text-left">Road Width Profile</th>
                  <th className="px-4 py-3.5 text-left">Environment</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-100 text-brand-dark">
                {displayedItems.map((item) => (
                  <tr key={item.environmentId} className="hover:bg-brand-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-brand-blue-900 whitespace-nowrap">
                      Segment {item.segmentId}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 text-[11px]">
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-200">
                          Junctions: {item.junctionCount}
                        </span>
                        <span className="bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-semibold border border-amber-200">
                          Schools: {item.schoolCount}
                        </span>
                        <span className="bg-rose-50 text-rose-700 px-1.5 py-0.5 rounded font-semibold border border-rose-200">
                          Hospitals: {item.hospitalCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 text-[11px]">
                        <span className="bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-semibold border border-indigo-200">
                          Signals: {item.trafficSignalCount}
                        </span>
                        <span className="bg-cyan-50 text-cyan-700 px-1.5 py-0.5 rounded font-semibold border border-cyan-200">
                          Pedestrian: {item.pedestrianCrossingCount}
                        </span>
                        <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded font-semibold border border-purple-200">
                          Railway: {item.railwayCrossingCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 text-[11px]">
                        <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-semibold border border-emerald-200">
                          Bridges: {item.bridgeCount}
                        </span>
                        <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-semibold border border-orange-200">
                          Curves: {item.curveCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium">
                      <div>Straight: <span className="font-bold">{item.straightRoadPercentage.toFixed(1)}%</span></div>
                      <div>Narrow: <span className="font-bold">{item.narrowRoadPercentage.toFixed(1)}%</span> | Wide: <span className="font-bold">{item.wideRoadPercentage.toFixed(1)}%</span></div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium">
                      <div className="text-blue-600 font-bold">Urban: {item.urbanPercentage.toFixed(1)}%</div>
                      <div className="text-emerald-600 font-bold">Rural: {item.ruralPercentage.toFixed(1)}%</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                          title="Edit Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(item.environmentId)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="p-4 bg-brand-gray-50 border-t border-brand-gray-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
              className="px-3 py-1.5 border border-brand-gray-200 rounded bg-white hover:bg-brand-gray-100 text-gray-700 text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Page <span className="font-bold text-brand-blue-900">{currentPage + 1}</span> of <span className="font-bold text-brand-blue-900">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1.5 border border-brand-gray-200 rounded bg-white hover:bg-brand-gray-100 text-gray-700 text-xs font-semibold shadow-xs flex items-center gap-1 transition-colors disabled:opacity-50 cursor-pointer"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl border border-brand-gray-200 w-full max-w-2xl my-8 overflow-hidden">
            <div className="p-5 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-brand-blue-900">
                {modalMode === "CREATE" ? "Add Road Environment Feature Record" : "Edit Road Environment Feature Record"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Segment Selection */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Road Segment <span className="text-red-500">*</span>
                </label>
                <select
                  value={segmentId}
                  onChange={(e) => setSegmentId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-xs focus:outline-none focus:border-brand-blue-800"
                >
                  <option value="">Select Segment...</option>
                  {segmentsList.length > 0 ? (
                    segmentsList.map((seg) => (
                      <option key={seg.id} value={seg.id}>
                        {seg.name}
                      </option>
                    ))
                  ) : (
                    Array.from({ length: 36 }, (_, i) => i + 1).map((id) => (
                      <option key={id} value={id}>
                        Segment {id}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Count Fields Grid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-brand-blue-900 uppercase tracking-wider">Infrastructure Counts</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Junction Count</label>
                    <input
                      type="number"
                      min="0"
                      value={junctionCount}
                      onChange={(e) => setJunctionCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">School Count</label>
                    <input
                      type="number"
                      min="0"
                      value={schoolCount}
                      onChange={(e) => setSchoolCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Hospital Count</label>
                    <input
                      type="number"
                      min="0"
                      value={hospitalCount}
                      onChange={(e) => setHospitalCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Railway Crossings</label>
                    <input
                      type="number"
                      min="0"
                      value={railwayCrossingCount}
                      onChange={(e) => setRailwayCrossingCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bridge Count</label>
                    <input
                      type="number"
                      min="0"
                      value={bridgeCount}
                      onChange={(e) => setBridgeCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Traffic Signals</label>
                    <input
                      type="number"
                      min="0"
                      value={trafficSignalCount}
                      onChange={(e) => setTrafficSignalCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Pedestrian Crossings</label>
                    <input
                      type="number"
                      min="0"
                      value={pedestrianCrossingCount}
                      onChange={(e) => setPedestrianCrossingCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Curve Count</label>
                    <input
                      type="number"
                      min="0"
                      value={curveCount}
                      onChange={(e) => setCurveCount(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Percentage Fields Grid */}
              <div className="space-y-2 pt-2 border-t border-brand-gray-200">
                <h4 className="text-xs font-bold text-brand-blue-900 uppercase tracking-wider">Road Type & Environment Percentages (%)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Straight Road (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={straightRoadPercentage}
                      onChange={(e) => setStraightRoadPercentage(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Narrow Road (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={narrowRoadPercentage}
                      onChange={(e) => setNarrowRoadPercentage(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Wide Road (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={wideRoadPercentage}
                      onChange={(e) => setWideRoadPercentage(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Urban Area (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={urbanPercentage}
                      onChange={(e) => setUrbanPercentage(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Rural Area (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={ruralPercentage}
                      onChange={(e) => setRuralPercentage(e.target.value)}
                      className="w-full px-2.5 py-1.5 border border-brand-gray-200 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-brand-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-brand-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-brand-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {submitting ? "Saving..." : modalMode === "CREATE" ? "Create Record" : "Update Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4 shadow-xl border border-brand-gray-200">
            <h3 className="text-base font-bold text-gray-900">Delete Environment Record?</h3>
            <p className="text-xs text-gray-600">
              Are you sure you want to delete this road environment feature record? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-3 py-1.5 border border-brand-gray-200 rounded text-xs font-semibold text-gray-600 hover:bg-brand-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold shadow-xs"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoadEnvironmentFeatures;
