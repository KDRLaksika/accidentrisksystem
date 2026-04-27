package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.TimeBasedRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.TimeBasedRiskAnalysisResponseDto;

import java.util.List;

public interface ITimeBasedRiskAnalysisService {

    TimeBasedRiskAnalysisResponseDto create(TimeBasedRiskAnalysisRequestDto request);

    TimeBasedRiskAnalysisResponseDto update(Long id, TimeBasedRiskAnalysisRequestDto request);

    void delete(Long id);

    TimeBasedRiskAnalysisResponseDto getById(Long id);

    PageResponse<TimeBasedRiskAnalysisResponseDto> getAll(int page, int size);

    void generateAnalysis();

    List<?> getTimeSlotDropdown();
}