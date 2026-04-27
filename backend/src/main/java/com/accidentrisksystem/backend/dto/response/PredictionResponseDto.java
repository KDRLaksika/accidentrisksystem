package com.accidentrisksystem.backend.dto.response;

import com.accidentrisksystem.backend.enums.RiskLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class PredictionResponseDto {

    private RiskLevel riskLevel;
}