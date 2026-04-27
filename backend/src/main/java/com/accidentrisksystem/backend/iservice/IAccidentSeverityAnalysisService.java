package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.AccidentSeverityAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.AccidentSeverityAnalysisResponseDto;

public interface IAccidentSeverityAnalysisService {

    AccidentSeverityAnalysisResponseDto create(AccidentSeverityAnalysisRequestDto request);

    AccidentSeverityAnalysisResponseDto update(Long id, AccidentSeverityAnalysisRequestDto request);

    void delete(Long id);

    AccidentSeverityAnalysisResponseDto getById(Long id);

    PageResponse<AccidentSeverityAnalysisResponseDto> getAll(int page, int size);

    void generateAnalysis();
}