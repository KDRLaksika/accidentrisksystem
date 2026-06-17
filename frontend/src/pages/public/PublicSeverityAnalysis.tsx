import React from "react";

const PublicSeverityAnalysis: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Severity Analysis</h1>
        <p className="text-sm text-gray-500 mt-1">Rule-based serious and fatal accident statistics aggregated by road segment (Read-Only).</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 space-y-4">
        <h2 className="text-lg font-bold text-brand-blue-900">Accident Severity Analysis</h2>
        <div className="h-96 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Severity Analysis Table Placeholder - Will be implemented in Task 7.
        </div>
      </div>
    </div>
  );
};

export default PublicSeverityAnalysis;
