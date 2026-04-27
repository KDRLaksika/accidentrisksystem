package com.accidentrisksystem.backend.dto.response;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MapSeverityRiskResponseDto {

    private Integer segmentId;
    private String geometry;
    private RiskLevel riskLevel;
}