package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.dto.request.PredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.PredictionResponseDto;

public interface IPredictionService {

    PredictionResponseDto predict(PredictionRequestDto request);
}