import React from "react";

const SegmentRiskMap: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Segment Risk Map</h1>
        <p className="text-sm text-gray-500 mt-1">Interactive GIS map showing accident risk level classification per kilometer segment.</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden h-[600px] flex flex-col">
        <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center justify-between">
          <span className="font-semibold text-brand-blue-900 text-sm">Panadura–Aluthgama Corridor Map</span>
          <div className="flex gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Low Risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-500 rounded-full inline-block"></span> Medium Risk</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span> High Risk</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
          Map Container Placeholder - Will be implemented in Task 6 using React Leaflet and coordinate projection.
        </div>
      </div>
    </div>
  );
};

export default SegmentRiskMap;
