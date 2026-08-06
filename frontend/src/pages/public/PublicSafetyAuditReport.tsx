import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import {
  FileText,
  Download,
  FileSpreadsheet,
  RefreshCw,
  AlertCircle,
  Layers,
  Filter,
  Sparkles
} from "lucide-react";

interface SegmentAuditDetail {
  segmentId: number;
  overallRiskLevel: string;
  environmentRiskLevel: string;
  junctionCount: number;
  schoolCount: number;
  hospitalCount: number;
  railwayCrossingCount: number;
  bridgeCount: number;
  trafficSignalCount: number;
  pedestrianCrossingCount: number;
  curveCount: number;
  straightRoadPercentage: number;
  narrowRoadPercentage: number;
  wideRoadPercentage: number;
  urbanPercentage: number;
  ruralPercentage: number;
  segmentRecommendations: string[];
}

interface SafetyAuditReportData {
  generatedAt: string;
  reportScope: string;
  selectedSegmentId: number | null;
  totalSegmentsAudited: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  segmentAudits: SegmentAuditDetail[];
  corridorRecommendations: string[];
}

const PublicSafetyAuditReport: React.FC = () => {
  const [reportData, setReportData] = useState<SafetyAuditReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [scope, setScope] = useState<"corridor" | "segment">("corridor");
  const [selectedSegmentId, setSelectedSegmentId] = useState<number>(1);

  const fetchAuditData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = scope === "segment"
        ? `/api/public/audit-report/data?segmentId=${selectedSegmentId}`
        : "/api/public/audit-report/data";

      const response = await api.get<SafetyAuditReportData>(url);
      if (response.success && response.data) {
        setReportData(response.data);
      } else {
        setError(response.message || "Failed to generate safety audit data.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching safety audit report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData();
  }, [scope, selectedSegmentId]);

  // Export PDF Function
  const exportPdfReport = () => {
    if (!reportData) return;

    const doc = new jsPDF("p", "mm", "a4");

    // Header Banner
    doc.setFillColor(15, 23, 42); // Navy Dark
    doc.rect(0, 0, 210, 32, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ROAD SAFETY AUDIT REPORT", 14, 15);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Segment-Level Road Accident Risk Prediction System (A2 Highway Corridor)", 14, 23);
    doc.text(`Generated: ${reportData.generatedAt}`, 140, 23);

    // Section 1: Executive Summary Box
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("1. EXECUTIVE AUDIT SUMMARY", 14, 42);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Audit Scope: ${reportData.reportScope}`, 14, 48);
    doc.text(`Target Region: Panadura - Aluthgama A2 Corridor (36 km)`, 14, 53);
    doc.text(`Total Road Segments Audited: ${reportData.totalSegmentsAudited}`, 14, 58);

    doc.text(`High Risk Segments: ${reportData.highRiskCount}`, 120, 48);
    doc.text(`Medium Risk Segments: ${reportData.mediumRiskCount}`, 120, 53);
    doc.text(`Low Risk Segments: ${reportData.lowRiskCount}`, 120, 58);

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 63, 196, 63);

    // Section 2: Segment Risk Breakdown Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("2. SEGMENT RISK AUDIT & ENVIRONMENTAL VULNERABILITY", 14, 71);

    const tableRows = reportData.segmentAudits.map((item) => [
      `Seg ${item.segmentId}`,
      item.overallRiskLevel,
      item.environmentRiskLevel,
      `${item.junctionCount}`,
      `${item.schoolCount}`,
      `${item.pedestrianCrossingCount}`,
      `${item.narrowRoadPercentage.toFixed(0)}%`,
      item.segmentRecommendations.length > 0 ? item.segmentRecommendations[0] : "Maintain standard infrastructure"
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Segment", "Overall Risk", "Env Risk", "Junctions", "Schools", "Crossings", "Narrow %", "Primary Countermeasure"]],
      body: tableRows,
      theme: "striped",
      styles: { fontSize: 7, cellPadding: 2 },
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 20, fontStyle: "bold" },
        2: { cellWidth: 20 },
        3: { cellWidth: 16 },
        4: { cellWidth: 14 },
        5: { cellWidth: 16 },
        6: { cellWidth: 16 },
        7: { cellWidth: "auto" }
      },
      didParseCell: function (data) {
        if (data.section === "body" && (data.column.index === 1 || data.column.index === 2)) {
          const val = String(data.cell.raw).toUpperCase();
          if (val.includes("HIGH")) {
            data.cell.styles.textColor = [220, 38, 38];
          } else if (val.includes("MEDIUM")) {
            data.cell.styles.textColor = [202, 138, 4];
          } else {
            data.cell.styles.textColor = [22, 163, 74];
          }
        }
      }
    });

    // Section 3: Aggregated Recommendations
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    if (finalY < 260) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("3. PRIORITY INFRASTRUCTURE RECOMMENDATIONS", 14, finalY);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      let currentY = finalY + 6;

      reportData.corridorRecommendations.slice(0, 5).forEach((rec, i) => {
        if (currentY < 280) {
          doc.text(`[${i + 1}] ${rec}`, 14, currentY);
          currentY += 5;
        }
      });
    }

    // Page Numbering Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${i} of ${pageCount} - Official Road Safety Audit Report`, 14, 290);
    }

    doc.save(scope === "segment" ? `Segment_${selectedSegmentId}_Safety_Audit_Report.pdf` : "A2_Corridor_Safety_Audit_Report.pdf");
  };

  // Export Excel Function
  const exportExcelReport = () => {
    if (!reportData) return;

    // Sheet 1: Summary Overview
    const summarySheetData = [
      ["ROAD SAFETY AUDIT REPORT SUMMARY"],
      ["Generated At", reportData.generatedAt],
      ["Audit Scope", reportData.reportScope],
      ["Total Segments Audited", reportData.totalSegmentsAudited],
      ["High Risk Segments", reportData.highRiskCount],
      ["Medium Risk Segments", reportData.mediumRiskCount],
      ["Low Risk Segments", reportData.lowRiskCount],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summarySheetData);

    // Sheet 2: Segment Audit Details
    const segmentDetailsData = reportData.segmentAudits.map((item) => ({
      "Segment ID": item.segmentId,
      "Overall Risk Level": item.overallRiskLevel,
      "Environment Risk Level": item.environmentRiskLevel,
      "Junction Count": item.junctionCount,
      "School Count": item.schoolCount,
      "Hospital Count": item.hospitalCount,
      "Railway Crossings": item.railwayCrossingCount,
      "Bridges": item.bridgeCount,
      "Traffic Signals": item.trafficSignalCount,
      "Pedestrian Crossings": item.pedestrianCrossingCount,
      "Curves": item.curveCount,
      "Straight Road %": item.straightRoadPercentage,
      "Narrow Road %": item.narrowRoadPercentage,
      "Wide Road %": item.wideRoadPercentage,
      "Urban %": item.urbanPercentage,
      "Rural %": item.ruralPercentage,
      "Recommended Interventions": item.segmentRecommendations.join(" | ")
    }));
    const wsDetails = XLSX.utils.json_to_sheet(segmentDetailsData);

    // Sheet 3: Priority Recommendations
    const recsData = reportData.corridorRecommendations.map((rec, idx) => ({
      "Priority": idx + 1,
      "Engineering Countermeasure Recommendation": rec
    }));
    const wsRecs = XLSX.utils.json_to_sheet(recsData);

    // Create Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, wsSummary, "Audit Summary");
    XLSX.utils.book_append_sheet(wb, wsDetails, "Segment Risk Audit");
    XLSX.utils.book_append_sheet(wb, wsRecs, "Countermeasures");

    XLSX.writeFile(wb, scope === "segment" ? `Segment_${selectedSegmentId}_Safety_Audit_Report.xlsx` : "A2_Corridor_Safety_Audit_Report.xlsx");
  };

  const getRiskBadge = (level: string) => {
    switch (level?.toUpperCase()) {
      case "HIGH":
        return <span className="bg-red-100 text-red-700 border border-red-300 text-xs px-2.5 py-0.5 rounded font-extrabold uppercase">High Risk</span>;
      case "MEDIUM":
        return <span className="bg-amber-100 text-amber-700 border border-amber-300 text-xs px-2.5 py-0.5 rounded font-extrabold uppercase">Medium Risk</span>;
      case "LOW":
      default:
        return <span className="bg-emerald-100 text-emerald-700 border border-emerald-300 text-xs px-2.5 py-0.5 rounded font-extrabold uppercase">Low Risk</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-brand-gray-200 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-blue-900 tracking-tight flex items-center gap-2">
            <FileText className="w-8 h-8 text-brand-blue-800 shrink-0" />
            Automated Safety Audit Report Generator
          </h1>
          <p className="text-sm text-gray-700 font-semibold mt-1">
            Generate official data-driven Road Safety Audit reports for the A2 Highway corridor (Panadura–Aluthgama). Export in executive PDF format or Excel (.xlsx) workbook.
          </p>
        </div>

        <button
          onClick={fetchAuditData}
          disabled={loading}
          className="self-start px-4 py-2 border border-brand-gray-200 hover:bg-brand-gray-100 text-gray-700 bg-white rounded text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Audit Data
        </button>
      </div>

      {/* Audit Scope Selector & Export Actions */}
      <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Scope Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-brand-blue-800" /> Audit Scope Selection
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setScope("corridor")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    scope === "corridor"
                      ? "bg-brand-blue-800 text-white shadow-xs"
                      : "bg-brand-gray-100 text-gray-700 hover:bg-brand-gray-200"
                  }`}
                >
                  Full Corridor (All 36 Segments)
                </button>
                <button
                  type="button"
                  onClick={() => setScope("segment")}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-all cursor-pointer ${
                    scope === "segment"
                      ? "bg-brand-blue-800 text-white shadow-xs"
                      : "bg-brand-gray-100 text-gray-700 hover:bg-brand-gray-200"
                  }`}
                >
                  Targeted Segment Deep-Dive
                </button>
              </div>
            </div>

            {scope === "segment" && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Select Road Segment</label>
                <select
                  value={selectedSegmentId}
                  onChange={(e) => setSelectedSegmentId(parseInt(e.target.value))}
                  className="px-3 py-1.5 border border-brand-gray-200 bg-white rounded text-xs font-semibold focus:outline-none focus:border-brand-blue-800 cursor-pointer"
                >
                  {Array.from({ length: 36 }, (_, i) => i + 1).map((id) => (
                    <option key={id} value={id}>
                      Segment {id} (A2 Highway)
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Export Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={exportPdfReport}
              disabled={loading || !reportData}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Official PDF Audit
            </button>

            <button
              onClick={exportExcelReport}
              disabled={loading || !reportData}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold shadow-xs flex items-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel Workbook (.xlsx)
            </button>
          </div>
        </div>
      </div>

      {/* Loading / Error / Preview */}
      {loading ? (
        <div className="bg-white rounded-lg border border-brand-gray-200 p-12 flex flex-col items-center justify-center space-y-4">
          <div className="w-10 h-10 border-4 border-brand-blue-800 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-gray-500">Compiling Road Safety Audit data...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-start gap-2 text-xs leading-normal">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Audit Generation Error</h4>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Executive Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-brand-gray-200 p-4 space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Audit Scope</span>
              <div className="text-base font-extrabold text-brand-blue-900">{reportData.reportScope}</div>
              <div className="text-xs text-gray-500 font-semibold">{reportData.totalSegmentsAudited} Segments Audited</div>
            </div>

            <div className="bg-red-50 rounded-lg border border-red-200 p-4 space-y-1">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">High Risk Blackspots</span>
              <div className="text-2xl font-extrabold text-red-700">{reportData.highRiskCount}</div>
              <div className="text-xs text-red-600 font-semibold">Priority engineering focus</div>
            </div>

            <div className="bg-amber-50 rounded-lg border border-amber-200 p-4 space-y-1">
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Medium Risk Segments</span>
              <div className="text-2xl font-extrabold text-amber-700">{reportData.mediumRiskCount}</div>
              <div className="text-xs text-amber-600 font-semibold">Moderate monitoring required</div>
            </div>

            <div className="bg-emerald-50 rounded-lg border border-emerald-200 p-4 space-y-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Low Risk Segments</span>
              <div className="text-2xl font-extrabold text-emerald-700">{reportData.lowRiskCount}</div>
              <div className="text-xs text-emerald-600 font-semibold">Standard maintenance</div>
            </div>
          </div>

          {/* Segment Audit & Risk Table Preview */}
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-brand-gray-50 border-b border-brand-gray-200 flex items-center justify-between">
              <span className="font-bold text-brand-blue-900 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-brand-blue-800" />
                Segment Risk Audit & Infrastructure Feature Matrix
              </span>
              <span className="text-xs text-gray-500 font-semibold">Showing {reportData.segmentAudits.length} Records</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-brand-gray-100 text-brand-blue-900 font-bold border-b border-brand-gray-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Segment</th>
                    <th className="p-3">Overall Risk</th>
                    <th className="p-3">Env Model Risk</th>
                    <th className="p-3 text-center">Junctions</th>
                    <th className="p-3 text-center">Schools</th>
                    <th className="p-3 text-center">Crossings</th>
                    <th className="p-3 text-center">Narrow Road %</th>
                    <th className="p-3">Key Recommended Countermeasure</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-gray-200">
                  {reportData.segmentAudits.map((item) => (
                    <tr key={item.segmentId} className="hover:bg-brand-gray-50 transition-colors">
                      <td className="p-3 font-bold text-brand-blue-900">Segment {item.segmentId}</td>
                      <td className="p-3">{getRiskBadge(item.overallRiskLevel)}</td>
                      <td className="p-3">{getRiskBadge(item.environmentRiskLevel)}</td>
                      <td className="p-3 text-center font-bold">{item.junctionCount}</td>
                      <td className="p-3 text-center font-bold">{item.schoolCount}</td>
                      <td className="p-3 text-center font-bold">{item.pedestrianCrossingCount}</td>
                      <td className="p-3 text-center font-bold">{item.narrowRoadPercentage.toFixed(0)}%</td>
                      <td className="p-3 text-gray-700 font-medium">
                        {item.segmentRecommendations.length > 0
                          ? item.segmentRecommendations[0]
                          : "Maintain standard corridor markings"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Priority Countermeasure Recommendations Card */}
          <div className="bg-white rounded-lg border border-brand-gray-200 shadow-xs p-5 space-y-4">
            <h3 className="text-base font-bold text-brand-blue-900 flex items-center gap-2 border-b border-brand-gray-100 pb-3">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Automated Data-Driven Engineering Recommendations
            </h3>

            <div className="space-y-2.5">
              {reportData.corridorRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-brand-gray-50 border border-brand-gray-200 rounded-md flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-brand-blue-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-gray-800 font-semibold leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PublicSafetyAuditReport;
