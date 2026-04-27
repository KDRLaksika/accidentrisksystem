package com.accidentrisksystem.backend.dto.response;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeBasedRiskAnalysisResponseDto {

    private Long resultId;
    private String timeSlot;
    private Integer accidentCount;
    private RiskLevel timeRiskLevel;
}