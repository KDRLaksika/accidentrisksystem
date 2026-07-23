package com.accidentrisksystem.backend.dto.response;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonthBasedRiskAnalysisResponseDto {

    private Long resultId;
    private String month;
    private Integer accidentCount;
    private RiskLevel monthRiskLevel;
}
