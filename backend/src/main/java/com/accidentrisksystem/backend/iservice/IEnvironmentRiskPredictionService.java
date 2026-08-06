package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.dto.request.EnvironmentRiskPredictionRequestDto;
import com.accidentrisksystem.backend.dto.request.WhatIfSimulationRequestDto;
import com.accidentrisksystem.backend.dto.response.EnvironmentRiskPredictionResponseDto;
import com.accidentrisksystem.backend.dto.response.TemporalMapAllSlotsResponseDto;
import com.accidentrisksystem.backend.dto.response.WhatIfSimulationResponseDto;

public interface IEnvironmentRiskPredictionService {

    EnvironmentRiskPredictionResponseDto predict(EnvironmentRiskPredictionRequestDto request);

    WhatIfSimulationResponseDto simulateCountermeasures(WhatIfSimulationRequestDto request);

    TemporalMapAllSlotsResponseDto getTemporalMapDataAllSlots();
}
