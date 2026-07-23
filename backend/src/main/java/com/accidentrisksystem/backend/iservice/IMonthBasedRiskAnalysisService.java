package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.MonthBasedRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.MonthBasedRiskAnalysisResponseDto;

import java.util.List;

public interface IMonthBasedRiskAnalysisService {

    MonthBasedRiskAnalysisResponseDto create(MonthBasedRiskAnalysisRequestDto request);

    MonthBasedRiskAnalysisResponseDto update(Long id, MonthBasedRiskAnalysisRequestDto request);

    void delete(Long id);

    MonthBasedRiskAnalysisResponseDto getById(Long id);

    PageResponse<MonthBasedRiskAnalysisResponseDto> getAll(int page, int size);

    void generateAnalysis();

    List<?> getMonthDropdown();
}
