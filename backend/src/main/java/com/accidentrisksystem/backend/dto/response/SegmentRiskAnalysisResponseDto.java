package com.accidentrisksystem.backend.dto.response;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SegmentRiskAnalysisResponseDto {

    private Long resultId;
    private Integer segmentId;
    private Integer accidentCount;
    private RiskLevel segmentRiskLevel;
}