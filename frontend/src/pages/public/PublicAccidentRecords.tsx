import React from "react";

const PublicAccidentRecords: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Accident Records</h1>
        <p className="text-sm text-gray-500 mt-1">Official road accident log for the Panadura–Aluthgama section (Read-Only).</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-blue-900">Recorded Accidents List</h2>
          <div className="text-xs text-gray-400 font-medium">Public view: read-only access</div>
        </div>
        
        <div className="h-96 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Accidents Table Placeholder - Will be implemented in Task 4 with backend endpoints.
        </div>
      </div>
    </div>
  );
};

export default PublicAccidentRecords;
