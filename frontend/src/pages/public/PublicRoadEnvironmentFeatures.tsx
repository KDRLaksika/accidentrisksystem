import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { AlertCircle, Search, Layers, ArrowUpDown } from "lucide-react";

export interface RoadEnvironmentFeaturesItem {
  environmentId: number;
  segmentId: number;
  junctionCount: number;
  schoolCount: number;
  hospitalCount: number;
  railwayCrossingCount: number;
  bridgeCount: number;
  trafficSignalCount: number;
  pedestrianCrossingCount: number;
  curveCount: number;
  straightRoadPercentage: number;
  narrowRoadPercentage: number;
  wideRoadPercentage: number;
  urbanPercentage: number;
  ruralPercentage: number;
  createdAt: string;
  updatedAt: string;
}

const PublicRoadEnvironmentFeatures: React.FC = () => {
  const [items, setItems] = useState<RoadEnvironmentFeaturesItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sort State
  const [sortField, setSortField] = useState<"segmentId" | "junctionCount" | "urbanPercentage">("segmentId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const fetchFeatures = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<RoadEnvironmentFeaturesItem[]>("/api/road-environment-features/all");
      if (response.success && response.data) {
        setItems(response.data);
      } else {
        setError(response.message || "Failed to load road environment features.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading environment data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, []);

  const handleSort = (field: "segmentId" | "junctionCount" | "urbanPercentage") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const filteredItems = items.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      searchTerm === "" ||
      item.segmentId.toString() === term ||
      `segment ${item.segmentId}`.toLowerCase().includes(term) ||
      `segment${item.segmentId}`.toLowerCase().includes(term)
    );
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const mult = sortDirection === "asc" ? 1 : -1;
    return (a[sortField] - b[sortField]) * mult;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
          <Layers className="w-8 h-8 text-brand-blue-800 shrink-0" />
          Road Environment Features
        </h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">
          Static road environment characteristics collected through a field survey of the A2 Road (Panadura–Aluthgama) (Read-Only).
        </p>
      </div>

      {/* Content Container */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
        {/* Search Bar */}
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
            Recorded Segments: <span className="text-brand-blue-900 font-bold">{sortedItems.length}</span>
          </div>
        </div>

        {/* Table Content */}
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-semibold text-gray-500">Loading road environment features...</p>
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
            No road environment features found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-gray-200 text-xs">
              <thead className="bg-brand-gray-50 font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th
                    onClick={() => handleSort("segmentId")}
                    className="px-4 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Segment ID
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-4 py-3.5 text-left">Key POIs / Infrastructure</th>
                  <th className="px-4 py-3.5 text-left">Signals & Crossings</th>
                  <th className="px-4 py-3.5 text-left">Geometry Characteristics</th>
                  <th className="px-4 py-3.5 text-left">Road Width Profile</th>
                  <th
                    onClick={() => handleSort("urbanPercentage")}
                    className="px-4 py-3.5 text-left cursor-pointer hover:bg-brand-gray-100 select-none transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      Environment Split
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-brand-gray-100 text-brand-dark">
                {sortedItems.map((item) => (
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
                      <div className="space-y-0.5">
                        <div>Straight: <span className="font-bold">{item.straightRoadPercentage.toFixed(1)}%</span></div>
                        <div>Narrow: <span className="font-bold">{item.narrowRoadPercentage.toFixed(1)}%</span> | Wide: <span className="font-bold">{item.wideRoadPercentage.toFixed(1)}%</span></div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-[11px] font-medium">
                      <div className="space-y-0.5">
                        <div className="text-blue-600 dark:text-blue-400 font-bold">Urban: {item.urbanPercentage.toFixed(1)}%</div>
                        <div className="text-emerald-600 dark:text-emerald-400 font-bold">Rural: {item.ruralPercentage.toFixed(1)}%</div>
                      </div>
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

export default PublicRoadEnvironmentFeatures;
