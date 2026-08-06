import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { parseAndProjectWktLineString } from "../../utils/geo";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import {
  AlertCircle,
  RefreshCw,
  Layers,
  Clock,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ShieldAlert
} from "lucide-react";

interface TemporalMapSegmentItem {
  segmentId: number;
  geometry: string;
  predictedRiskLevel: string;
  classProbabilities: { [key: string]: number };
}

interface TemporalMapAllSlotsResponse {
  timeSlotMap: { [key: string]: TemporalMapSegmentItem[] };
}

const TIME_SLOTS = [
  { value: "00:00-03:00", label: "00:00 - 03:00", desc: "Late Night" },
  { value: "03:00-06:00", label: "03:00 - 06:00", desc: "Early Morning" },
  { value: "06:00-09:00", label: "06:00 - 09:00", desc: "Morning Rush & School Time" },
  { value: "09:00-12:00", label: "09:00 - 12:00", desc: "Mid-Morning Traffic" },
  { value: "12:00-15:00", label: "12:00 - 15:00", desc: "Afternoon & School Close" },
  { value: "15:00-18:00", label: "15:00 - 18:00", desc: "Late Afternoon Peak" },
  { value: "18:00-21:00", label: "18:00 - 21:00", desc: "Evening Rush Hour" },
  { value: "21:00-00:00", label: "21:00 - 00:00", desc: "Night Corridor" },
];

const TemporalRiskMap: React.FC = () => {
  const [dataMap, setDataMap] = useState<{ [key: string]: TemporalMapSegmentItem[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeSlotIndex, setActiveSlotIndex] = useState<number>(2); // Default 06:00-09:00
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const fetchTemporalMapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<TemporalMapAllSlotsResponse>("/api/public/map/temporal-risk/all-slots");
      if (response.success && response.data && response.data.timeSlotMap) {
        setDataMap(response.data.timeSlotMap);
      } else {
        setError(response.message || "Failed to load temporal map data.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while connecting to spatial temporal services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemporalMapData();
  }, []);

  // Timer loop for auto-play
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveSlotIndex((prev) => (prev + 1) % TIME_SLOTS.length);
      }, 2200);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const activeSlot = TIME_SLOTS[activeSlotIndex];
  const activeSegments = dataMap[activeSlot.value] || [];

  // Summary counts
  const highRiskCount = activeSegments.filter((s) => s.predictedRiskLevel?.toUpperCase() === "HIGH").length;
  const mediumRiskCount = activeSegments.filter((s) => s.predictedRiskLevel?.toUpperCase() === "MEDIUM").length;
  const lowRiskCount = activeSegments.filter((s) => s.predictedRiskLevel?.toUpperCase() === "LOW").length;

  const getRiskColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return "#ef4444"; // Red
      case "MEDIUM":
        return "#eab308"; // Yellow
      case "LOW":
      default:
        return "#22c55e"; // Green
    }
  };

  const centerPosition: [number, number] = [6.57, 79.96];
  const defaultZoom = 11;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
            <Clock className="w-8 h-8 text-brand-blue-800 shrink-0" />
            Temporal Risk Heatmap
          </h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            Spatial-temporal GIS risk heatmap of the A2 Highway corridor (Panadura–Aluthgama). Animate across 24 hours to observe how spatial accident risk evolves dynamically throughout the day.
          </p>
        </div>

        <button
          onClick={fetchTemporalMapData}
          disabled={loading}
          className="self-start px-4 py-2 border border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload Map Data
        </button>
      </div>

      {/* Timeline Controls & Summary Bar */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-5 space-y-4">
        {/* Active Slot Info & Stats Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-gray-100 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Time Slot</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold text-brand-blue-900">{activeSlot.label}</span>
              <span className="text-xs font-bold text-gray-600 bg-brand-gray-100 px-2.5 py-0.5 rounded-full border border-brand-gray-200">
                {activeSlot.desc}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold">
            <div className="bg-red-50 text-red-800 border border-red-200 px-3 py-1.5 rounded-md flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-red-600" />
              <span>High Risk: <strong className="font-extrabold text-sm">{highRiskCount}</strong> segments</span>
            </div>
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-md">
              Medium: <strong className="font-extrabold text-sm">{mediumRiskCount}</strong>
            </div>
            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-md">
              Low: <strong className="font-extrabold text-sm">{lowRiskCount}</strong>
            </div>
          </div>
        </div>

        {/* Playback Controls & Slider */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className={`px-4 py-2 rounded text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isPlaying
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-brand-blue-800 hover:bg-brand-blue-900 text-white"
                }`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause 24h Loop" : "Play 24h Loop"}
              </button>

              <button
                type="button"
                onClick={() => setActiveSlotIndex((prev) => (prev === 0 ? TIME_SLOTS.length - 1 : prev - 1))}
                className="p-2 border border-brand-gray-200 hover:bg-brand-gray-100 rounded text-gray-700 bg-white"
                title="Previous Time Window"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setActiveSlotIndex((prev) => (prev + 1) % TIME_SLOTS.length)}
                className="p-2 border border-brand-gray-200 hover:bg-brand-gray-100 rounded text-gray-700 bg-white"
                title="Next Time Window"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>

            <span className="text-xs font-bold text-gray-500">
              Window {activeSlotIndex + 1} of {TIME_SLOTS.length}
            </span>
          </div>

          {/* Timeline Range Slider */}
          <input
            type="range"
            min={0}
            max={TIME_SLOTS.length - 1}
            value={activeSlotIndex}
            onChange={(e) => {
              setIsPlaying(false);
              setActiveSlotIndex(parseInt(e.target.value));
            }}
            className="w-full h-2.5 bg-brand-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue-800"
          />

          {/* Slot Pill Selector Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
            {TIME_SLOTS.map((slot, idx) => (
              <button
                key={slot.value}
                onClick={() => {
                  setIsPlaying(false);
                  setActiveSlotIndex(idx);
                }}
                className={`py-1.5 px-2 rounded text-[11px] font-bold text-center border transition-all cursor-pointer ${
                  activeSlotIndex === idx
                    ? "bg-brand-blue-800 text-white border-brand-blue-900 shadow-xs"
                    : "bg-brand-gray-50 text-gray-600 border-brand-gray-200 hover:bg-brand-gray-100"
                }`}
              >
                {slot.value}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Map Content Box */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden h-[600px] flex flex-col relative">
        {/* Map Header Legends */}
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-20">
          <span className="font-semibold text-brand-blue-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-blue-800" />
            Live Spatial Corridor Heatmap ({activeSlot.label})
          </span>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-green-500 rounded-full inline-block border border-green-600"></span>
              Low Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-yellow-500 rounded-full inline-block border border-yellow-600"></span>
              Medium Risk
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 bg-red-500 rounded-full inline-block border border-red-600"></span>
              High Risk
            </span>
          </div>
        </div>

        {/* Loading / Error / Map */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-brand-gray-50">
            <div className="w-12 h-12 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-gray-500">Loading temporal GIS spatial map layers...</p>
          </div>
        ) : error ? (
          <div className="flex-1 p-6 bg-brand-gray-50 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal max-w-md">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">Temporal GIS Map Fault</h4>
                <p className="mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full h-full relative">
            <MapContainer
              center={centerPosition}
              zoom={defaultZoom}
              scrollWheelZoom={true}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {activeSegments.map((item) => {
                const positions = parseAndProjectWktLineString(item.geometry);
                if (positions.length === 0) return null;

                const color = getRiskColor(item.predictedRiskLevel);

                return (
                  <Polyline
                    key={item.segmentId}
                    positions={positions}
                    pathOptions={{
                      color: color,
                      weight: 7,
                      opacity: 0.9,
                      lineCap: "round",
                    }}
                    eventHandlers={{
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({ weight: 11, opacity: 1.0 });
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({ weight: 7, opacity: 0.9 });
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-2 p-1">
                        <div className="font-extrabold text-brand-blue-900 border-b border-brand-gray-200 pb-1 flex justify-between items-center">
                          <span>A2 Segment {item.segmentId}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{activeSlot.value}</span>
                        </div>

                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-medium text-gray-500">Predicted Risk:</span>
                          <span
                            className="font-extrabold uppercase px-2 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${color}20`,
                              color: color,
                              border: `1px solid ${color}`,
                            }}
                          >
                            {item.predictedRiskLevel} Risk
                          </span>
                        </div>

                        {item.classProbabilities && (
                          <div className="space-y-1 pt-1.5 border-t border-brand-gray-100 text-[11px]">
                            <div className="font-bold text-gray-600">Class Probabilities:</div>
                            {Object.entries(item.classProbabilities).map(([riskClass, prob]) => (
                              <div key={riskClass} className="flex justify-between text-[10px]">
                                <span>{riskClass}:</span>
                                <span className="font-bold">{prob}%</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Popup>
                  </Polyline>
                );
              })}
            </MapContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemporalRiskMap;
