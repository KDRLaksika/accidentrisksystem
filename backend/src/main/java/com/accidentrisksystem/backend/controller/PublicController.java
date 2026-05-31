package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.dto.response.MapSegmentRiskResponseDto;
import com.accidentrisksystem.backend.dto.response.MapSeverityRiskResponseDto;
import com.accidentrisksystem.backend.iservice.ISegmentRiskAnalysisService;
import com.accidentrisksystem.backend.iservice.IAccidentSeverityAnalysisService;
import com.accidentrisksystem.backend.repository.SegmentRiskAnalysisRepository;
import com.accidentrisksystem.backend.repository.AccidentSeverityAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final SegmentRiskAnalysisRepository segmentRiskAnalysisRepository;
    private final AccidentSeverityAnalysisRepository accidentSeverityAnalysisRepository;

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
}