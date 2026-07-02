import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import { User, ShieldAlert, Key, CheckCircle, AlertCircle } from "lucide-react";

interface AdminProfileDetails {
  adminId: number;
  fullName: string;
  email: string;
  username: string;
  isActive: boolean;
}

const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<AdminProfileDetails | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Password fields
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordSubmitting, setPasswordSubmitting] = useState(false);

  // Fetch admin profile
  const fetchProfile = async () => {
    setProfileLoading(true);
    setProfileError(null);
    try {
      const response = await api.get<AdminProfileDetails>("/api/admin/profile");
      if (response.success && response.data) {
        setProfile(response.data);
      } else {
        setProfileError(response.message || "Failed to load admin profile details.");
      }
    } catch (err: any) {
      setProfileError(err.message || "An error occurred while loading profile details.");
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    // Simple validations
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("All password fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 5) {
      setPasswordError("New password must be at least 5 characters long.");
      return;
    }

    setPasswordSubmitting(true);
    try {
      const response = await api.put<void>("/api/admin/change-password", {
        oldPassword: oldPassword,
        newPassword: newPassword,
      });

      if (response.success) {
        setPasswordSuccess("Password changed successfully.");
        // Reset inputs
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordError(response.message || "Failed to change password.");
      }
    } catch (err: any) {
      setPasswordError(err.message || "Could not change password. Please verify current credentials.");
    } finally {
      setPasswordSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="border-b border-brand-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight">Admin Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage system administrator details and account security.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center gap-2">
              <User className="w-5 h-5 text-brand-blue-800" />
              <span className="font-bold text-brand-blue-900 text-sm">Account Details</span>
            </div>

            <div className="p-6">
              {profileLoading ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-2">
                  <div className="w-8 h-8 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs text-gray-500">Loading details...</p>
                </div>
              ) : profileError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2 text-xs leading-normal">
                  <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{profileError}</span>
                </div>
              ) : profile ? (
                <div className="space-y-6">
                  {/* Profile Avatar */}
                  <div className="flex items-center gap-4 border-b border-brand-gray-100 pb-4">
                    <div className="w-14 h-14 bg-brand-blue-100 text-brand-blue-800 rounded-full flex items-center justify-center font-bold text-xl uppercase">
                      {profile.fullName.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-brand-blue-900">{profile.fullName}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                        {profile.isActive ? "Active Account" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Metadata Table */}
                  <div className="space-y-3.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Admin ID</span>
                      <span className="font-bold text-brand-blue-900">{profile.adminId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Username</span>
                      <span className="font-bold text-brand-blue-900">{profile.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-medium">Email Address</span>
                      <span className="font-bold text-brand-blue-900">{profile.email}</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center gap-2">
              <Key className="w-5 h-5 text-brand-blue-800" />
              <span className="font-bold text-brand-blue-900 text-sm">Change Admin Password</span>
            </div>

            <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
              {/* Success Notification Banner */}
              {passwordSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-start gap-2 text-xs leading-normal">
                  <CheckCircle className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              {/* Error Notification Banner */}
              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-start gap-2 text-xs leading-normal">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  disabled={passwordSubmitting}
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={passwordSubmitting}
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  placeholder="At least 5 characters"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={passwordSubmitting}
                  className="w-full px-3 py-2 border border-brand-gray-200 rounded text-sm focus:outline-none focus:border-brand-blue-800 disabled:opacity-50"
                  placeholder="Re-enter new password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSubmitting}
                  className="px-5 py-2 bg-brand-blue-800 hover:bg-brand-blue-900 text-white rounded text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {passwordSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
