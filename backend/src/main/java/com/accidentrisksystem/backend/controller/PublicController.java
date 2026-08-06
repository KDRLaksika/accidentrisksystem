package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.dto.request.PredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.MapSegmentRiskResponseDto;
import com.accidentrisksystem.backend.dto.response.MapSeverityRiskResponseDto;
import com.accidentrisksystem.backend.dto.response.PredictionResponseDto;
import com.accidentrisksystem.backend.iservice.IPredictionService;
import com.accidentrisksystem.backend.repository.AccidentSeverityAnalysisRepository;
import com.accidentrisksystem.backend.repository.SegmentRiskAnalysisRepository;
import com.accidentrisksystem.backend.dto.request.EnvironmentRiskPredictionRequestDto;
import com.accidentrisksystem.backend.dto.response.EnvironmentRiskPredictionResponseDto;
import com.accidentrisksystem.backend.iservice.IEnvironmentRiskPredictionService;
import com.accidentrisksystem.backend.dto.request.WhatIfSimulationRequestDto;
import com.accidentrisksystem.backend.dto.response.WhatIfSimulationResponseDto;
import com.accidentrisksystem.backend.dto.response.TemporalMapAllSlotsResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final SegmentRiskAnalysisRepository segmentRiskAnalysisRepository;
    private final AccidentSeverityAnalysisRepository accidentSeverityAnalysisRepository;
    private final IPredictionService predictionService;
    private final IEnvironmentRiskPredictionService environmentRiskPredictionService;

    @GetMapping("/map/segment-risk")
    public ApiResponse<List<MapSegmentRiskResponseDto>> getSegmentRiskMap() {

        List<MapSegmentRiskResponseDto> result = segmentRiskAnalysisRepository.findAll()
                .stream()
                .map(item -> {
                    MapSegmentRiskResponseDto dto = new MapSegmentRiskResponseDto();
                    dto.setSegmentId(item.getRoadSegment().getSegmentId());
                    dto.setGeometry(item.getRoadSegment().getGeometry().toText());
                    dto.setRiskLevel(item.getSegmentRiskLevel());
                    return dto;
                })
                .toList();

        return ApiResponse.success("Segment risk map data", result);
    }

    @GetMapping("/map/severity-risk")
    public ApiResponse<List<MapSeverityRiskResponseDto>> getSeverityRiskMap() {

        List<MapSeverityRiskResponseDto> result = accidentSeverityAnalysisRepository.findAll()
                .stream()
                .map(item -> {
                    MapSeverityRiskResponseDto dto = new MapSeverityRiskResponseDto();
                    dto.setSegmentId(item.getRoadSegment().getSegmentId());
                    dto.setGeometry(item.getRoadSegment().getGeometry().toText());
                    dto.setRiskLevel(item.getSegmentRiskLevel());
                    return dto;
                })
                .toList();

        return ApiResponse.success("Severity risk map data", result);
    }

    @PostMapping("/predict")
    public ApiResponse<PredictionResponseDto> predictRisk(
            @RequestBody PredictionRequestDto request
    ) {
        PredictionResponseDto response = predictionService.predict(request);

        return ApiResponse.success("Prediction completed successfully", response);
    }

    @PostMapping("/environment-risk/predict")
    public ApiResponse<EnvironmentRiskPredictionResponseDto> predictEnvironmentRisk(
            @RequestBody EnvironmentRiskPredictionRequestDto request
    ) {
        EnvironmentRiskPredictionResponseDto response = environmentRiskPredictionService.predict(request);

        return ApiResponse.success("Environment risk prediction completed successfully", response);
    }

    @PostMapping("/environment-risk/simulate")
    public ApiResponse<WhatIfSimulationResponseDto> simulateCountermeasures(
            @RequestBody WhatIfSimulationRequestDto request
    ) {
        WhatIfSimulationResponseDto response = environmentRiskPredictionService.simulateCountermeasures(request);

        return ApiResponse.success("Countermeasure simulation completed successfully", response);
    }

    @GetMapping("/map/temporal-risk/all-slots")
    public ApiResponse<TemporalMapAllSlotsResponseDto> getTemporalMapAllSlots() {
        TemporalMapAllSlotsResponseDto response = environmentRiskPredictionService.getTemporalMapDataAllSlots();

        return ApiResponse.success("Temporal risk map data for all slots", response);
    }
}