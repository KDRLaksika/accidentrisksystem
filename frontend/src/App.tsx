import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth integrations
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout wrappers
import PublicLayout from "./components/PublicLayout";
import AdminLayout from "./components/AdminLayout";

// Public pages
import PublicOverview from "./pages/public/PublicOverview";
import PublicAccidentRecords from "./pages/public/PublicAccidentRecords";
import SegmentRiskMap from "./pages/public/SegmentRiskMap";
import SeverityRiskMap from "./pages/public/SeverityRiskMap";
import PublicSegmentRiskAnalysis from "./pages/public/PublicSegmentRiskAnalysis";
import PublicSeverityAnalysis from "./pages/public/PublicSeverityAnalysis";
import PublicTimeBasedAnalysis from "./pages/public/PublicTimeBasedAnalysis";
import PublicMonthBasedAnalysis from "./pages/public/PublicMonthBasedAnalysis";
import PublicRoadEnvironmentFeatures from "./pages/public/PublicRoadEnvironmentFeatures";
import MLPrediction from "./pages/public/MLPrediction";
import PublicEnvironmentRiskPrediction from "./pages/public/PublicEnvironmentRiskPrediction";
import PublicWhatIfSimulation from "./pages/public/PublicWhatIfSimulation";
import TemporalRiskMap from "./pages/public/TemporalRiskMap";

// Login page
import Login from "./pages/Login";

// Admin pages
import AdminOverview from "./pages/admin/AdminOverview";
import AdminAccidentRecords from "./pages/admin/AdminAccidentRecords";
import AdminRoadSegments from "./pages/admin/AdminRoadSegments";
import AdminSegmentRanges from "./pages/admin/AdminSegmentRanges";
import AdminSegmentRiskAnalysis from "./pages/admin/AdminSegmentRiskAnalysis";
import AdminSeverityAnalysis from "./pages/admin/AdminSeverityAnalysis";
import AdminTimeBasedAnalysis from "./pages/admin/AdminTimeBasedAnalysis";
import AdminMonthBasedAnalysis from "./pages/admin/AdminMonthBasedAnalysis";
import AdminRoadEnvironmentFeatures from "./pages/admin/AdminRoadEnvironmentFeatures";
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes with Public Layout */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <PublicOverview />
              </PublicLayout>
            }
          />
          <Route
            path="/records"
            element={
              <PublicLayout>
                <PublicAccidentRecords />
              </PublicLayout>
            }
          />
          <Route
            path="/map"
            element={
              <PublicLayout>
                <SegmentRiskMap />
              </PublicLayout>
            }
          />
          <Route
            path="/risk-map"
            element={
              <PublicLayout>
                <SegmentRiskMap />
              </PublicLayout>
            }
          />
          <Route
            path="/severity-map"
            element={
              <PublicLayout>
                <SeverityRiskMap />
              </PublicLayout>
            }
          />
          <Route
            path="/segment-risk"
            element={
              <PublicLayout>
                <PublicSegmentRiskAnalysis />
              </PublicLayout>
            }
          />
          <Route
            path="/severity-analysis"
            element={
              <PublicLayout>
                <PublicSeverityAnalysis />
              </PublicLayout>
            }
          />
          <Route
            path="/time-based"
            element={
              <PublicLayout>
                <PublicTimeBasedAnalysis />
              </PublicLayout>
            }
          />
          <Route
            path="/month-risk"
            element={
              <PublicLayout>
                <PublicMonthBasedAnalysis />
              </PublicLayout>
            }
          />
          <Route
            path="/road-environment"
            element={
              <PublicLayout>
                <PublicRoadEnvironmentFeatures />
              </PublicLayout>
            }
          />
          <Route
            path="/ml-prediction"
            element={
              <PublicLayout>
                <MLPrediction />
              </PublicLayout>
            }
          />
          <Route
            path="/environment-risk"
            element={
              <PublicLayout>
                <PublicEnvironmentRiskPrediction />
              </PublicLayout>
            }
          />
          <Route
            path="/what-if-simulation"
            element={
              <PublicLayout>
                <PublicWhatIfSimulation />
              </PublicLayout>
            }
          />
          <Route
            path="/temporal-map"
            element={
              <PublicLayout>
                <TemporalRiskMap />
              </PublicLayout>
            }
          />

          {/* Login View */}
          <Route path="/login" element={<Login />} />

          {/* Admin Routes with Admin Layout (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminOverview />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/records"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminAccidentRecords />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/segments"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminRoadSegments />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/ranges"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSegmentRanges />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/segment-risk"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSegmentRiskAnalysis />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/severity"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminSeverityAnalysis />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/time-based"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminTimeBasedAnalysis />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/month-risk"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminMonthBasedAnalysis />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/road-environment"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminRoadEnvironmentFeatures />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <AdminProfile />
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;