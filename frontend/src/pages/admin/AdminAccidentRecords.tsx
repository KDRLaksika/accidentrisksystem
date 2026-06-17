import React from "react";

const AdminAccidentRecords: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Manage Accidents</h1>
        <p className="text-sm text-gray-500 mt-1">Administrative portal to insert, update, and delete road accident records.</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-blue-900">Accident Records (Admin CRUD Mode)</h2>
          <button className="bg-brand-blue-800 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-brand-blue-900 transition-colors">
            Add New Record
          </button>
        </div>

        <div className="h-96 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Accidents CRUD Table & Forms Placeholder - Will be implemented in Task 4.
        </div>
      </div>
    </div>
  );
};

export default AdminAccidentRecords;
