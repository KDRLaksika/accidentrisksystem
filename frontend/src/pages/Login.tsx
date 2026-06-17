import React from "react";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg border border-brand-gray-200 shadow-md w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-blue-800 rounded-lg flex items-center justify-center text-white text-2xl font-bold mx-auto">
            AR
          </div>
          <h2 className="text-2xl font-bold text-brand-blue-900">Admin Portal Login</h2>
          <p className="text-xs text-gray-500">Enter your credentials to access management controls</p>
        </div>

        <div className="h-64 flex items-center justify-center bg-brand-gray-50 border border-dashed border-brand-gray-200 rounded-md text-gray-400 text-sm">
          Login Form Placeholder - Will be implemented in Task 2.
        </div>
      </div>
    </div>
  );
};

export default Login;
