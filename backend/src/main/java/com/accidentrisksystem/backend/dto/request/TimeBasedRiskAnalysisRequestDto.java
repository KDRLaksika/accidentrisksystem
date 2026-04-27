package com.accidentrisksystem.backend.dto.request;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TimeBasedRiskAnalysisRequestDto {

    private String timeSlot;
    private Integer accidentCount;
    private RiskLevel timeRiskLevel;
}