import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import MLPrediction from "./pages/public/MLPrediction";

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
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  return (
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
          path="/ml-prediction"
          element={
            <PublicLayout>
              <MLPrediction />
            </PublicLayout>
          }
        />

        {/* Login View */}
        <Route path="/login" element={<Login />} />

        {/* Admin Routes with Admin Layout */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <AdminOverview />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/records"
          element={
            <AdminLayout>
              <AdminAccidentRecords />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/segments"
          element={
            <AdminLayout>
              <AdminRoadSegments />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/ranges"
          element={
            <AdminLayout>
              <AdminSegmentRanges />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/segment-risk"
          element={
            <AdminLayout>
              <AdminSegmentRiskAnalysis />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/severity"
          element={
            <AdminLayout>
              <AdminSeverityAnalysis />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/time-based"
          element={
            <AdminLayout>
              <AdminTimeBasedAnalysis />
            </AdminLayout>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;