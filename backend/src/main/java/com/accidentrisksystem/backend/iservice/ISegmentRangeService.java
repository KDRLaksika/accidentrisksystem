package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.SegmentRangeRequestDto;
import com.accidentrisksystem.backend.dto.response.SegmentRangeResponseDto;

public interface ISegmentRangeService {

    SegmentRangeResponseDto create(SegmentRangeRequestDto request);

    SegmentRangeResponseDto update(Long id, SegmentRangeRequestDto request);

    void delete(Long id);

    SegmentRangeResponseDto getById(Long id);

    PageResponse<SegmentRangeResponseDto> getAll(int page, int size);
}