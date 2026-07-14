import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { parseAndProjectWktLineString } from "../../utils/geo";
import { MapContainer, TileLayer, Polyline, Popup } from "react-leaflet";
import { AlertCircle, RefreshCw, Layers } from "lucide-react";

interface SegmentRiskMapItem {
  segmentId: number;
  geometry: string;
  riskLevel: string;
}

const SegmentRiskMap: React.FC = () => {
  const [mapItems, setMapItems] = useState<SegmentRiskMapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<SegmentRiskMapItem[]>("/api/public/map/segment-risk");
      if (response.success && response.data) {
        setMapItems(response.data || []);
      } else {
        setError(response.message || "Failed to load segment risk map data.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading map data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, []);

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

  // Center coordinates for Panadura–Aluthgama section of A2
  const centerPosition: [number, number] = [6.57, 79.96];
  const defaultZoom = 11;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Segment Risk Map</h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">Interactive GIS map showing accident risk level classification per kilometer segment.</p>
        </div>
        <button
          onClick={fetchMapData}
          disabled={loading}
          className="self-start px-4 py-2 border border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Reload Map
        </button>
      </div>

      {/* Map Content Box */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden h-[600px] flex flex-col relative">
        {/* Legends bar */}
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 z-20">
          <span className="font-semibold text-brand-blue-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-blue-800" />
            A2 Corridor Segmentation Layout
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

        {/* Loading Overlay */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-brand-gray-50">
            <div className="w-12 h-12 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-semibold text-gray-500">Loading spatial GIS maps...</p>
          </div>
        ) : error ? (
          <div className="flex-1 p-6 bg-brand-gray-50 flex items-center justify-center">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal max-w-md">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold">GIS Interface Fault</h4>
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

              {mapItems.map((item) => {
                const positions = parseAndProjectWktLineString(item.geometry);
                if (positions.length === 0) return null;

                const color = getRiskColor(item.riskLevel);

                return (
                  <Polyline
                    key={item.segmentId}
                    positions={positions}
                    pathOptions={{
                      color: color,
                      weight: 6,
                      opacity: 0.85,
                      lineCap: "round",
                    }}
                    eventHandlers={{
                      mouseover: (e) => {
                        const layer = e.target;
                        layer.setStyle({ weight: 9, opacity: 1.0 });
                      },
                      mouseout: (e) => {
                        const layer = e.target;
                        layer.setStyle({ weight: 6, opacity: 0.85 });
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1.5 p-1">
                        <div className="font-bold text-brand-blue-900 border-b border-brand-gray-200 pb-1">
                          A2 Segment {item.segmentId}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="font-medium text-gray-500">Risk Status:</span>
                          <span
                            className="font-extrabold uppercase px-1.5 py-0.5 rounded text-[10px]"
                            style={{
                              backgroundColor: `${color}20`, // Add transparency (hex + 20)
                              color: color,
                              border: `1px solid ${color}`,
                            }}
                          >
                            {item.riskLevel} Risk
                          </span>
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          Kilometer corridor segment classification
                        </div>
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

export default SegmentRiskMap;
