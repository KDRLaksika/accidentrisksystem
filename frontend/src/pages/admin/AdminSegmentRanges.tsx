import React from "react";

const AdminSegmentRanges: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Segment Ranges</h1>
        <p className="text-sm text-gray-500 mt-1">Manage physical boundaries and kilometer ranges for the A2 Highway corridor segments.</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-blue-900">Segment Ranges (Admin CRUD Mode)</h2>
          <button className="bg-brand-blue-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-brand-blue-900 transition-colors">
            Add New Range
          </button>
        </div>

        <div className="h-96 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Segment Ranges Table Placeholder - Will be implemented in Task 5.
        </div>
      </div>
    </div>
  );
};

export default AdminSegmentRanges;
