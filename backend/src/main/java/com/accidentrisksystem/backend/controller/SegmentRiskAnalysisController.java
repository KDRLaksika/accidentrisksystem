package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.SegmentRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.SegmentRiskAnalysisResponseDto;
import com.accidentrisksystem.backend.iservice.ISegmentRiskAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/segment-risk-analysis")
@RequiredArgsConstructor
public class SegmentRiskAnalysisController {

    private final ISegmentRiskAnalysisService segmentRiskAnalysisService;

    @PostMapping
    public ApiResponse<SegmentRiskAnalysisResponseDto> create(
            @RequestBody SegmentRiskAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Segment risk analysis created",
                segmentRiskAnalysisService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<SegmentRiskAnalysisResponseDto> update(
            @PathVariable Long id,
            @RequestBody SegmentRiskAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Segment risk analysis updated",
                segmentRiskAnalysisService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        segmentRiskAnalysisService.delete(id);
        return ApiResponse.success("Segment risk analysis deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<SegmentRiskAnalysisResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Segment risk analysis fetched",
                segmentRiskAnalysisService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<SegmentRiskAnalysisResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Segment risk analysis list",
                segmentRiskAnalysisService.getAll(page, size)
        );
    }

    @PostMapping("/generate")
    public ApiResponse<Void> generateAnalysis() {
        segmentRiskAnalysisService.generateAnalysis();
        return ApiResponse.success("Segment risk analysis generated", null);
    }
}