package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.dto.request.PredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.PredictionResponseDto;
import com.accidentrisksystem.backend.enums.RiskLevel;
import com.accidentrisksystem.backend.iservice.IPredictionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PredictionService implements IPredictionService {

    @Override
    public PredictionResponseDto predict(PredictionRequestDto request) {

        /*
         * TEMPORARY LOGIC
         * Later this method will call FastAPI ML service.
         *
         * Final flow:
         * Spring Boot -> FastAPI -> Random Forest model -> risk_level
         *
         * Input:
         * segmentId
         * timeCategory
         */

        RiskLevel predictedRisk = RiskLevel.LOW;

        return new PredictionResponseDto(predictedRisk);
    }
}