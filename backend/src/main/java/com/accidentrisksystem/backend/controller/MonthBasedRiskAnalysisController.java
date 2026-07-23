package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.MonthBasedRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.MonthBasedRiskAnalysisResponseDto;
import com.accidentrisksystem.backend.iservice.IMonthBasedRiskAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/month-based-risk-analysis")
@RequiredArgsConstructor
public class MonthBasedRiskAnalysisController {

    private final IMonthBasedRiskAnalysisService monthBasedRiskAnalysisService;

    @PostMapping
    public ApiResponse<MonthBasedRiskAnalysisResponseDto> create(
            @RequestBody MonthBasedRiskAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Month-based risk analysis created",
                monthBasedRiskAnalysisService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<MonthBasedRiskAnalysisResponseDto> update(
            @PathVariable Long id,
            @RequestBody MonthBasedRiskAnalysisRequestDto request
    ) {
        return ApiResponse.success(
                "Month-based risk analysis updated",
                monthBasedRiskAnalysisService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        monthBasedRiskAnalysisService.delete(id);
        return ApiResponse.success("Month-based risk analysis deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<MonthBasedRiskAnalysisResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Month-based risk analysis fetched",
                monthBasedRiskAnalysisService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<MonthBasedRiskAnalysisResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Month-based risk analysis list",
                monthBasedRiskAnalysisService.getAll(page, size)
        );
    }

    @PostMapping("/generate")
    public ApiResponse<Void> generateAnalysis() {
        monthBasedRiskAnalysisService.generateAnalysis();
        return ApiResponse.success("Month-based risk analysis generated", null);
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<?>> getMonthDropdown() {
        return ApiResponse.success(
                "Month dropdown",
                monthBasedRiskAnalysisService.getMonthDropdown()
        );
    }
}
