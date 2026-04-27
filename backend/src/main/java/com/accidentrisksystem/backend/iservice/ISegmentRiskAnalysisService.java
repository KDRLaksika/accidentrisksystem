package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.SegmentRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.SegmentRiskAnalysisResponseDto;

public interface ISegmentRiskAnalysisService {

    SegmentRiskAnalysisResponseDto create(SegmentRiskAnalysisRequestDto request);

    SegmentRiskAnalysisResponseDto update(Long id, SegmentRiskAnalysisRequestDto request);

    void delete(Long id);

    SegmentRiskAnalysisResponseDto getById(Long id);

    PageResponse<SegmentRiskAnalysisResponseDto> getAll(int page, int size);

    void generateAnalysis();
}