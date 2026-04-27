package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.response.RoadSegmentResponseDto;

import java.util.List;

public interface IRoadSegmentService {

    RoadSegmentResponseDto getById(Integer id);

    PageResponse<RoadSegmentResponseDto> getAll(int page, int size);

    List<?> getDropdown();
}