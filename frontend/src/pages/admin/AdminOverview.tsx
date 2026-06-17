import React from "react";

const AdminOverview: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Admin Overview Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">System monitoring and administrative metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Accidents</p>
            <h3 className="text-3xl font-extrabold text-brand-blue-900 mt-2">1,428</h3>
          </div>
          <p className="text-xs text-red-500 mt-4 flex items-center font-medium">
            <span>↗ 4%</span>
            <span className="text-gray-400 ml-1">from last month</span>
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Segments</p>
            <h3 className="text-3xl font-extrabold text-brand-blue-900 mt-2">36</h3>
          </div>
          <p className="text-xs text-green-600 mt-4 flex items-center font-medium">
            <span>Verified</span>
            <span className="text-gray-400 ml-1">Active in system</span>
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border border-brand-gray-200 shadow-xs">
        <h2 className="text-lg font-bold text-brand-blue-900 mb-4">Accident Statistics & Control Chart</h2>
        <div className="h-64 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Chart Placeholder - Will be implemented in Task 3.
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
