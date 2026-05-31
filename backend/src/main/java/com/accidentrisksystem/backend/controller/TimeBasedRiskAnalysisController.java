package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.TimeBasedRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.TimeBasedRiskAnalysisResponseDto;
import com.accidentrisksystem.backend.iservice.ITimeBasedRiskAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/time-based-risk-analysis")
@RequiredArgsConstructor
public class TimeBasedRiskAnalysisController {

    private final ITimeBasedRiskAnalysisService timeBasedRiskAnalysisService;

    @PostMapping
    public ApiResponse<TimeBasedRiskAnalysisResponseDto> create(
            @RequestBody TimeBasedRiskAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Time-based risk analysis created",
                timeBasedRiskAnalysisService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<TimeBasedRiskAnalysisResponseDto> update(
            @PathVariable Long id,
            @RequestBody TimeBasedRiskAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Time-based risk analysis updated",
                timeBasedRiskAnalysisService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        timeBasedRiskAnalysisService.delete(id);
        return ApiResponse.success("Time-based risk analysis deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<TimeBasedRiskAnalysisResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Time-based risk analysis fetched",
                timeBasedRiskAnalysisService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<TimeBasedRiskAnalysisResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Time-based risk analysis list",
                timeBasedRiskAnalysisService.getAll(page, size)
        );
    }

    @PostMapping("/generate")
    public ApiResponse<Void> generateAnalysis() {
        timeBasedRiskAnalysisService.generateAnalysis();
        return ApiResponse.success("Time-based risk analysis generated", null);
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<?>> getTimeSlotDropdown() {
        return ApiResponse.success(
                "Time slot dropdown",
                timeBasedRiskAnalysisService.getTimeSlotDropdown()
        );
    }
}