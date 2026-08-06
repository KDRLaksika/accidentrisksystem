package com.accidentrisksystem.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WhatIfSimulationResponseDto {

    private Integer segmentId;
    private String timeCategory;
    private boolean riskLevelChanged;
    private Double primaryProbabilityDelta;
    private EnvironmentRiskPredictionResponseDto baselineResult;
    private EnvironmentRiskPredictionResponseDto simulatedResult;
}
