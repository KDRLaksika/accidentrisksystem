package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.AccidentSeverityAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.AccidentSeverityAnalysisResponseDto;
import com.accidentrisksystem.backend.iservice.IAccidentSeverityAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/accident-severity-analysis")
@RequiredArgsConstructor
public class AccidentSeverityAnalysisController {

    private final IAccidentSeverityAnalysisService accidentSeverityAnalysisService;

    @PostMapping
    public ApiResponse<AccidentSeverityAnalysisResponseDto> create(
            @RequestBody AccidentSeverityAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Accident severity analysis created",
                accidentSeverityAnalysisService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<AccidentSeverityAnalysisResponseDto> update(
            @PathVariable Long id,
            @RequestBody AccidentSeverityAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Accident severity analysis updated",
                accidentSeverityAnalysisService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        accidentSeverityAnalysisService.delete(id);
        return ApiResponse.success("Accident severity analysis deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<AccidentSeverityAnalysisResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Accident severity analysis fetched",
                accidentSeverityAnalysisService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<AccidentSeverityAnalysisResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Accident severity analysis list",
                accidentSeverityAnalysisService.getAll(page, size)
        );
    }

    @PostMapping("/generate")
    public ApiResponse<Void> generateAnalysis() {
        accidentSeverityAnalysisService.generateAnalysis();
        return ApiResponse.success("Accident severity analysis generated", null);
    }
}