package com.accidentrisksystem.backend.dto.request;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccidentSeverityAnalysisRequestDto {

    private Integer segmentId;
    private Integer fatalCount;
    private Integer seriousCount;
    private RiskLevel segmentRiskLevel;
}