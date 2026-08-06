package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.dto.request.EnvironmentRiskPredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.EnvironmentRiskPredictionResponseDto;
import com.accidentrisksystem.backend.dto.response.SafetyAuditReportDto;
import com.accidentrisksystem.backend.entity.RoadEnvironmentFeatures;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.entity.SegmentRiskAnalysis;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IEnvironmentRiskPredictionService;
import com.accidentrisksystem.backend.iservice.ISafetyAuditReportService;
import com.accidentrisksystem.backend.repository.RoadEnvironmentFeaturesRepository;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import com.accidentrisksystem.backend.repository.SegmentRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SafetyAuditReportService implements ISafetyAuditReportService {

    private final RoadSegmentRepository roadSegmentRepository;
    private final RoadEnvironmentFeaturesRepository environmentFeaturesRepository;
    private final SegmentRiskAnalysisRepository segmentRiskAnalysisRepository;
    private final IEnvironmentRiskPredictionService environmentRiskPredictionService;

    @Override
    public SafetyAuditReportDto generateAuditReport(Integer segmentId) {
        List<RoadSegment> allSegments = roadSegmentRepository.findAll();
        Map<Integer, RoadEnvironmentFeatures> envMap = new HashMap<>();
        environmentFeaturesRepository.findAll().forEach(env -> {
            if (env.getRoadSegment() != null) {
                envMap.put(env.getRoadSegment().getSegmentId(), env);
            }
        });

        Map<Integer, SegmentRiskAnalysis> riskMap = new HashMap<>();
        segmentRiskAnalysisRepository.findAll().forEach(risk -> {
            if (risk.getRoadSegment() != null) {
                riskMap.put(risk.getRoadSegment().getSegmentId(), risk);
            }
        });

        List<RoadSegment> targetSegments;
        String scopeLabel;

        if (segmentId != null) {
            RoadSegment segment = roadSegmentRepository.findById(segmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Segment not found with ID: " + segmentId));
            targetSegments = Collections.singletonList(segment);
            scopeLabel = "Segment " + segmentId + " Audit";
        } else {
            targetSegments = allSegments;
            scopeLabel = "Full Corridor (A2 Highway)";
        }

        List<SafetyAuditReportDto.SegmentAuditDetailDto> auditDetails = new ArrayList<>();
        int highCount = 0;
        int medCount = 0;
        int lowCount = 0;

        Set<String> aggregatedRecommendations = new LinkedHashSet<>();

        for (RoadSegment segment : targetSegments) {
            int segId = segment.getSegmentId();
            RoadEnvironmentFeatures env = envMap.get(segId);
            SegmentRiskAnalysis histRisk = riskMap.get(segId);

            String histRiskLevel = (histRisk != null && histRisk.getSegmentRiskLevel() != null)
                    ? histRisk.getSegmentRiskLevel().name()
                    : "Low";

            String envRiskLevel = "Low";
            try {
                EnvironmentRiskPredictionResponseDto pred = environmentRiskPredictionService.predict(
                        new EnvironmentRiskPredictionRequestDto(segId, "06:00-09:00")
                );
                if (pred != null && pred.getPredictedRiskLevel() != null) {
                    envRiskLevel = pred.getPredictedRiskLevel();
                }
            } catch (Exception ignored) {}

            String overallRisk = histRiskLevel;
            if ("High".equalsIgnoreCase(histRiskLevel) || "High".equalsIgnoreCase(envRiskLevel)) {
                overallRisk = "High";
                highCount++;
            } else if ("Medium".equalsIgnoreCase(histRiskLevel) || "Medium".equalsIgnoreCase(envRiskLevel)) {
                overallRisk = "Medium";
                medCount++;
            } else {
                overallRisk = "Low";
                lowCount++;
            }

            int jc = (env != null && env.getJunctionCount() != null) ? env.getJunctionCount() : 0;
            int sc = (env != null && env.getSchoolCount() != null) ? env.getSchoolCount() : 0;
            int hc = (env != null && env.getHospitalCount() != null) ? env.getHospitalCount() : 0;
            int rc = (env != null && env.getRailwayCrossingCount() != null) ? env.getRailwayCrossingCount() : 0;
            int bc = (env != null && env.getBridgeCount() != null) ? env.getBridgeCount() : 0;
            int ts = (env != null && env.getTrafficSignalCount() != null) ? env.getTrafficSignalCount() : 0;
            int pc = (env != null && env.getPedestrianCrossingCount() != null) ? env.getPedestrianCrossingCount() : 0;
            int cc = (env != null && env.getCurveCount() != null) ? env.getCurveCount() : 0;

            double str = (env != null && env.getStraightRoadPercentage() != null) ? env.getStraightRoadPercentage().doubleValue() : 0.0;
            double nrw = (env != null && env.getNarrowRoadPercentage() != null) ? env.getNarrowRoadPercentage().doubleValue() : 0.0;
            double wde = (env != null && env.getWideRoadPercentage() != null) ? env.getWideRoadPercentage().doubleValue() : 0.0;
            double urb = (env != null && env.getUrbanPercentage() != null) ? env.getUrbanPercentage().doubleValue() : 0.0;
            double rur = (env != null && env.getRuralPercentage() != null) ? env.getRuralPercentage().doubleValue() : 0.0;

            List<String> segRecs = new ArrayList<>();
            if (jc >= 3 && ts == 0) {
                segRecs.add("High junction density (" + jc + " junctions) without traffic signals. Install automated signalized intersections.");
            }
            if (sc >= 1 && pc <= 2) {
                segRecs.add("School zone (" + sc + " school) with low pedestrian crossings. Construct high-visibility pedestrian crossing with flashing warning beacons.");
            }
            if (nrw >= 35.0) {
                segRecs.add("High narrow road ratio (" + String.format("%.1f", nrw) + "%). Shoulder expansion and lane widening recommended.");
            }
            if (cc >= 2) {
                segRecs.add("Sharp curve section (" + cc + " curves). Install retro-reflective hazard markers & anti-skid surface coating.");
            }
            if (rc >= 1) {
                segRecs.add("Railway crossing corridor section (" + rc + " crossing). Upgrade to automated dual-arm barrier gates.");
            }
            if (segRecs.isEmpty()) {
                segRecs.add("Maintain standard corridor road markings, LED street lighting, and routine surface maintenance.");
            }

            aggregatedRecommendations.addAll(segRecs);

            auditDetails.add(new SafetyAuditReportDto.SegmentAuditDetailDto(
                    segId,
                    overallRisk,
                    envRiskLevel,
                    jc, sc, hc, rc, bc, ts, pc, cc,
                    str, nrw, wde, urb, rur,
                    segRecs
            ));
        }

        // Sort by risk priority (High -> Medium -> Low)
        auditDetails.sort((a, b) -> {
            int pA = "High".equalsIgnoreCase(a.getOverallRiskLevel()) ? 3 : "Medium".equalsIgnoreCase(a.getOverallRiskLevel()) ? 2 : 1;
            int pB = "High".equalsIgnoreCase(b.getOverallRiskLevel()) ? 3 : "Medium".equalsIgnoreCase(b.getOverallRiskLevel()) ? 2 : 1;
            return Integer.compare(pB, pA);
        });

        String nowFormatted = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));

        return new SafetyAuditReportDto(
                nowFormatted,
                scopeLabel,
                segmentId,
                targetSegments.size(),
                highCount,
                medCount,
                lowCount,
                auditDetails,
                new ArrayList<>(aggregatedRecommendations)
        );
    }
}
