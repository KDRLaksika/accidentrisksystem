package com.accidentrisksystem.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SafetyAuditReportDto {

    private String generatedAt;
    private String reportScope;
    private Integer selectedSegmentId;
    private int totalSegmentsAudited;
    private int highRiskCount;
    private int mediumRiskCount;
    private int lowRiskCount;

    private List<SegmentAuditDetailDto> segmentAudits;
    private List<String> corridorRecommendations;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SegmentAuditDetailDto {
        private Integer segmentId;
        private String overallRiskLevel;
        private String environmentRiskLevel;
        private int junctionCount;
        private int schoolCount;
        private int hospitalCount;
        private int railwayCrossingCount;
        private int bridgeCount;
        private int trafficSignalCount;
        private int pedestrianCrossingCount;
        private int curveCount;
        private double straightRoadPercentage;
        private double narrowRoadPercentage;
        private double wideRoadPercentage;
        private double urbanPercentage;
        private double ruralPercentage;
        private List<String> segmentRecommendations;
    }
}
