package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.RoadEnvironmentFeaturesRequestDto;
import com.accidentrisksystem.backend.dto.response.RoadEnvironmentFeaturesResponseDto;

import java.util.List;

public interface IRoadEnvironmentFeaturesService {

    RoadEnvironmentFeaturesResponseDto create(RoadEnvironmentFeaturesRequestDto request);

    RoadEnvironmentFeaturesResponseDto update(Long id, RoadEnvironmentFeaturesRequestDto request);

    void delete(Long id);

    RoadEnvironmentFeaturesResponseDto getById(Long id);

    RoadEnvironmentFeaturesResponseDto getBySegmentId(Integer segmentId);

    PageResponse<RoadEnvironmentFeaturesResponseDto> getAll(int page, int size);

    List<RoadEnvironmentFeaturesResponseDto> getAllList();
}
