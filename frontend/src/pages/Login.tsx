import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { BarChart3, AlertCircle, Lock, User } from "lucide-react";

interface LoginResponse {
  token: string;
}

const Login: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect straight to admin panel
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post<LoginResponse>("/api/auth/login", {
        username: username.trim(),
        password: password,
      });

      if (response.success && response.data?.token) {
        login(response.data.token);
        navigate("/admin");
      } else {
        setError(response.message || "Invalid username or password.");
      }
    } catch (err: any) {
      setError(err.message || "Unable to connect to the authentication service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg border border-brand-gray-200 shadow-md w-full max-w-md space-y-6">
        {/* Branding header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-blue-800 rounded-lg flex items-center justify-center text-white shadow-xs mx-auto">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-brand-blue-900 tracking-tight mt-3">Admin Portal Login</h2>
          <p className="text-xs text-gray-500">Enter your credentials to access system management</p>
        </div>

        {/* Error Notification Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2 text-xs leading-normal">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Username</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={submitting}
                className="w-full pl-9 pr-3 py-2 border border-brand-gray-200 rounded bg-brand-gray-50/50 text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={submitting}
                className="w-full pl-9 pr-3 py-2 border border-brand-gray-200 rounded bg-brand-gray-50/50 text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-sm font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Authenticating...
              </>
            ) : (
              "Access Admin Panel"
            )}
          </button>
        </form>

        <div className="border-t border-brand-gray-200 pt-4 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-xs font-semibold text-brand-blue-800 hover:underline inline-block"
          >
            ← Return to Public Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
