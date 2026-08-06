import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AlertCircle, ShieldCheck, ClipboardList, Map, PlusCircle, Ruler, RefreshCw } from "lucide-react";

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
}

interface SegmentRiskData {
  segmentId: number;
  accidentCount: number;
  segmentRiskLevel: string;
}

interface SeverityData {
  segmentId: number;
  fatalCount: number;
  seriousCount: number;
  segmentRiskLevel: string;
}

interface TimeBasedData {
  timeSlot: string;
  accidentCount: number;
  timeRiskLevel: string;
}

interface MonthBasedData {
  month: string;
  accidentCount: number;
  monthRiskLevel: string;
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

const getRegionName = (segmentId: number) => {
  if (segmentId >= 1 && segmentId <= 4) return "Panadura";
  if (segmentId === 18) return "Kalutara";
  if (segmentId >= 34 && segmentId <= 36) return "Aluthgama";
  return null;
};

const CustomizedAxisTick = (props: any) => {
  const { x, y, payload } = props;
  const val = Number(payload.value);

  let areaLabel = "";
  if (val === 2) {
    areaLabel = "Panadura";
  } else if (val === 18) {
    areaLabel = "Kalutara";
  } else if (val === 34) {
    areaLabel = "Aluthgama";
  }

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={12} textAnchor="middle" className="fill-gray-600 dark:fill-white" fontSize={10} fontWeight="600">
        {payload.value}
      </text>
      {areaLabel && (
        <text x={0} y={0} dy={28} textAnchor="middle" className="fill-brand-blue-900 dark:fill-white" fontSize={12} fontWeight="900">
          {areaLabel}
        </text>
      )}
    </g>
  );
};

const AdminOverview: React.FC = () => {
  const navigate = useNavigate();

  const [totalAccidents, setTotalAccidents] = useState<number>(0);
  const [totalSegments, setTotalSegments] = useState<number>(36);
  const [segmentRiskData, setSegmentRiskData] = useState<SegmentRiskData[]>([]);
  const [severityData, setSeverityData] = useState<SeverityData[]>([]);
  const [timeBasedData, setTimeBasedData] = useState<TimeBasedData[]>([]);
  const [monthBasedData, setMonthBasedData] = useState<MonthBasedData[]>([]);
  const [environmentCount, setEnvironmentCount] = useState<number>(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [accidentsRes, segmentsRes, segmentRiskRes, severityRes, timeBasedRes, monthBasedRes, environmentRes] = await Promise.all([
        api.get<PaginatedResponse<any>>("/api/accident-records?size=1"),
        api.get<PaginatedResponse<any>>("/api/road-segments?size=1"),
        api.get<PaginatedResponse<SegmentRiskData>>("/api/segment-risk-analysis?size=100"),
        api.get<PaginatedResponse<SeverityData>>("/api/accident-severity-analysis?size=100"),
        api.get<PaginatedResponse<TimeBasedData>>("/api/time-based-risk-analysis?size=100"),
        api.get<PaginatedResponse<MonthBasedData>>("/api/month-based-risk-analysis?size=100"),
        api.get<any[]>("/api/road-environment-features/all")
      ]);

      setTotalAccidents(accidentsRes.data?.totalElements || 0);
      setTotalSegments(segmentsRes.data?.totalElements || 36);
      setEnvironmentCount(environmentRes.data?.length || 0);

      const sortedSegmentRisk = (segmentRiskRes.data?.content || []).sort((a, b) => a.segmentId - b.segmentId);
      setSegmentRiskData(sortedSegmentRisk);

      const sortedSeverity = (severityRes.data?.content || []).sort((a, b) => a.segmentId - b.segmentId);
      setSeverityData(sortedSeverity);

      setTimeBasedData(timeBasedRes.data?.content || []);

      const sortedMonthBased = (monthBasedRes.data?.content || []).sort((a, b) => {
        return (MONTH_ORDER[a.month] || 0) - (MONTH_ORDER[b.month] || 0);
      });
      setMonthBasedData(sortedMonthBased);
    } catch (err: any) {
      setError("Unable to retrieve aggregate statistics. Database might be uninitialized.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isDataEmpty = segmentRiskData.length === 0 && timeBasedData.length === 0 && severityData.length === 0 && monthBasedData.length === 0;

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Admin Overview</h1>
        <p className="text-sm text-gray-700 font-semibold mt-1">System status and analytical visualizations.</p>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Retrieving system statistics...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Error Loading Statistics</h4>
            <p className="text-xs mt-1">{error}</p>
          </div>
        </div>
      ) : (
        <>
          {/* KPI Cards & Admin Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* KPI Cards */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Recorded Accidents</p>
                    <h3 className="text-4xl font-extrabold text-brand-blue-900 mt-2">{totalAccidents}</h3>
                  </div>
                  <div className="p-3 bg-brand-blue-50 text-brand-blue-800 rounded-md">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs text-red-500 mt-6 flex items-center font-medium">
                  <span>↗ 4.2%</span>
                  <span className="text-gray-400 ml-1">cumulative database log</span>
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">Total Monitored Segments</p>
                    <h3 className="text-4xl font-extrabold text-brand-blue-900 mt-2">{totalSegments}</h3>
                  </div>
                  <div className="p-3 bg-brand-blue-50 text-brand-blue-800 rounded-md">
                    <Map className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-xs text-green-600 mt-6 flex items-center font-medium gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified PostGIS Geometries Active</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Quick Management Actions</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => navigate("/admin/records")}
                  className="flex items-center gap-3 p-4 border border-brand-gray-200 hover:border-brand-blue-600 hover:bg-brand-blue-50/50 rounded-lg text-left transition-all cursor-pointer group"
                >
                  <PlusCircle className="w-6 h-6 text-brand-blue-855 group-hover:text-brand-blue-905 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-brand-blue-900">Add Accident Record</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Input a new incident details.</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/ranges")}
                  className="flex items-center gap-3 p-4 border border-brand-gray-200 hover:border-brand-blue-600 hover:bg-brand-blue-50/50 rounded-lg text-left transition-all cursor-pointer group"
                >
                  <Ruler className="w-6 h-6 text-brand-blue-850 group-hover:text-brand-blue-900 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-brand-blue-900">Manage Boundaries</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Modify segment kilometer markers.</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/segment-risk")}
                  className="flex items-center gap-3 p-4 border border-brand-gray-200 hover:border-brand-blue-600 hover:bg-brand-blue-50/50 rounded-lg text-left transition-all cursor-pointer group"
                >
                  <RefreshCw className="w-6 h-6 text-brand-blue-855 group-hover:text-brand-blue-900 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-brand-blue-900">Recalculate Risk</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Re-run backend risk rule modules.</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {isDataEmpty ? (
            <div className="bg-white p-12 rounded-lg border border-brand-gray-200 text-center space-y-3">
              <AlertCircle className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-brand-blue-900">No Generated Analytics Found</h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto">
                No rule-based calculations are currently persisted. Run the analysis generator under the Segment Risk, Severity, or Time-Based tabs to calculate and view statistics.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {/* Chart 1: Accident count per segment */}
              {segmentRiskData.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-brand-blue-900">Accident Frequency per Segment</h2>
                    <p className="text-xs text-gray-700 font-semibold">Kilometer segments (1–36) on the Panadura–Aluthgama section.</p>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={segmentRiskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="segmentId" tick={<CustomizedAxisTick />} height={55} />
                        <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-gray-600 dark:text-white" />
                        <Tooltip
                          contentStyle={{ fontSize: 12, borderRadius: 6 }}
                          labelFormatter={(value) => {
                            const region = getRegionName(Number(value));
                            return region ? `Segment ${value} (${region})` : `Segment ${value}`;
                          }}
                        />
                        <Bar dataKey="accidentCount" fill="#1e40af" radius={[4, 4, 0, 0]} name="Accidents" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart 2: Fatal vs Serious */}
                {severityData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-brand-blue-900">Accident Severity by Segment</h2>
                      <p className="text-xs text-gray-700 font-semibold">Distribution of fatal vs serious incidents.</p>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="segmentId" tick={<CustomizedAxisTick />} height={55} />
                          <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-gray-600 dark:text-white" />
                          <Tooltip
                            contentStyle={{ fontSize: 12, borderRadius: 6 }}
                            labelFormatter={(value) => {
                              const region = getRegionName(Number(value));
                              return region ? `Segment ${value} (${region})` : `Segment ${value}`;
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="fatalCount" fill="#dc2626" radius={[3, 3, 0, 0]} name="Fatal" />
                          <Bar dataKey="seriousCount" fill="#2563eb" radius={[3, 3, 0, 0]} name="Serious" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {/* Chart 3: Time based distribution */}
                {timeBasedData.length > 0 && (
                  <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs">
                    <div className="mb-4">
                      <h2 className="text-lg font-bold text-brand-blue-900">Time-Slot Accident Distribution</h2>
                      <p className="text-xs text-gray-700 font-semibold">Comparative accident counts across time slots.</p>
                    </div>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeBasedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis
                            dataKey="timeSlot"
                            ticks={[
                              "01:00-02:00",
                              "04:00-05:00",
                              "07:00-08:00",
                              "10:00-11:00",
                              "13:00-14:00",
                              "16:00-17:00",
                              "19:00-20:00",
                              "22:00-23:00"
                            ]}
                            tick={{ fontSize: 9, fontWeight: "bold", fill: "currentColor" }}
                            className="text-gray-700 dark:text-white"
                          />
                          <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-gray-600 dark:text-white" />
                          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                          <Bar dataKey="accidentCount" fill="#d97706" radius={[4, 4, 0, 0]} name="Accidents" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart 4: Month based distribution */}
              {monthBasedData.length > 0 && (
                <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs">
                  <div className="mb-4">
                    <h2 className="text-lg font-bold text-brand-blue-900">Month-Based Accident Distribution</h2>
                    <p className="text-xs text-gray-700 font-semibold">Comparative accident counts across different calendar months.</p>
                  </div>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthBasedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: "bold", fill: "currentColor" }} className="text-gray-700 dark:text-white" />
                        <YAxis tick={{ fontSize: 11, fill: "currentColor" }} className="text-gray-600 dark:text-white" />
                        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6 }} />
                        <Bar dataKey="accidentCount" fill="#6366f1" radius={[4, 4, 0, 0]} name="Accidents" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Section 5: Road Environment Features Management */}
              <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-brand-blue-900">Road Environment Features</h2>
                  <p className="text-xs text-gray-700 font-semibold mt-0.5">
                    Field survey environment characteristics, infrastructure POI counts, geometry & land-use percentages.
                  </p>
                </div>
                <a
                  href="/admin/road-environment"
                  className="px-4 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-xs font-bold shadow-xs whitespace-nowrap transition-colors"
                >
                  Manage Environment Features ({environmentCount} Segments Configured)
                </a>
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default AdminOverview;
