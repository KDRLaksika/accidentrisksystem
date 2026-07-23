package com.accidentrisksystem.backend.dto.request;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthBasedRiskAnalysisRequestDto {

    private String month;
    private Integer accidentCount;
    private RiskLevel monthRiskLevel;
}
