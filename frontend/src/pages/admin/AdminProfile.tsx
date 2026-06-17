import React from "react";

const AdminProfile: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage admin account details and security settings.</p>
      </div>

      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-6 max-w-xl">
        <h2 className="text-lg font-bold text-brand-blue-900 mb-4">Security Settings</h2>
        <div className="h-64 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Change Password Forms Placeholder - Will be implemented in Task 2.
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
      
