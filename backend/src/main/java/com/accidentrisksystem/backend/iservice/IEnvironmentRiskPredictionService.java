package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.dto.request.EnvironmentRiskPredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.EnvironmentRiskPredictionResponseDto;

public interface IEnvironmentRiskPredictionService {

    EnvironmentRiskPredictionResponseDto predict(EnvironmentRiskPredictionRequestDto request);
}
