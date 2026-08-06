package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.RoadEnvironmentFeaturesRequestDto;
import com.accidentrisksystem.backend.dto.response.RoadEnvironmentFeaturesResponseDto;
import com.accidentrisksystem.backend.entity.RoadEnvironmentFeatures;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.exception.BadRequestException;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IRoadEnvironmentFeaturesService;
import com.accidentrisksystem.backend.repository.RoadEnvironmentFeaturesRepository;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadEnvironmentFeaturesService implements IRoadEnvironmentFeaturesService {

    private final RoadEnvironmentFeaturesRepository environmentRepository;
    private final RoadSegmentRepository roadSegmentRepository;

    @Override
    public RoadEnvironmentFeaturesResponseDto create(RoadEnvironmentFeaturesRequestDto request) {
        if (request.getSegmentId() == null) {
            throw new BadRequestException("Segment ID is required");
        }

        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found with id: " + request.getSegmentId()));

        if (environmentRepository.existsBySegmentId(request.getSegmentId())) {
            throw new BadRequestException("Road environment features record already exists for segment ID: " + request.getSegmentId());
        }

        RoadEnvironmentFeatures entity = new RoadEnvironmentFeatures();
        entity.setRoadSegment(roadSegment);
        updateEntityFromDto(entity, request);

        RoadEnvironmentFeatures saved = environmentRepository.save(entity);
        return mapToResponse(saved);
    }

    @Override
    public RoadEnvironmentFeaturesResponseDto update(Long id, RoadEnvironmentFeaturesRequestDto request) {
        RoadEnvironmentFeatures entity = environmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Road environment features record not found with id: " + id));

        if (request.getSegmentId() != null && !request.getSegmentId().equals(entity.getRoadSegment().getSegmentId())) {
            RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Road segment not found with id: " + request.getSegmentId()));

            if (environmentRepository.existsBySegmentId(request.getSegmentId())) {
                throw new BadRequestException("Road environment features record already exists for segment ID: " + request.getSegmentId());
            }
            entity.setRoadSegment(roadSegment);
        }

        updateEntityFromDto(entity, request);
        RoadEnvironmentFeatures saved = environmentRepository.save(entity);
        return mapToResponse(saved);
    }

    @Override
    public void delete(Long id) {
        RoadEnvironmentFeatures entity = environmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Road environment features record not found with id: " + id));
        environmentRepository.delete(entity);
    }

    @Override
    public RoadEnvironmentFeaturesResponseDto getById(Long id) {
        RoadEnvironmentFeatures entity = environmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Road environment features record not found with id: " + id));
        return mapToResponse(entity);
    }

    @Override
    public RoadEnvironmentFeaturesResponseDto getBySegmentId(Integer segmentId) {
        RoadEnvironmentFeatures entity = environmentRepository.findBySegmentId(segmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Road environment features record not found for segment ID: " + segmentId));
        return mapToResponse(entity);
    }

    @Override
    public PageResponse<RoadEnvironmentFeaturesResponseDto> getAll(int page, int size) {
        Page<RoadEnvironmentFeatures> entityPage = environmentRepository.findAll(PageRequest.of(page, size));
        List<RoadEnvironmentFeaturesResponseDto> content = entityPage.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return new PageResponse<>(
                content,
                entityPage.getNumber(),
                entityPage.getSize(),
                entityPage.getTotalElements(),
                entityPage.getTotalPages(),
                entityPage.isLast()
        );
    }

    @Override
    public List<RoadEnvironmentFeaturesResponseDto> getAllList() {
        return environmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    private void updateEntityFromDto(RoadEnvironmentFeatures entity, RoadEnvironmentFeaturesRequestDto dto) {
        if (dto.getJunctionCount() != null) entity.setJunctionCount(dto.getJunctionCount());
        if (dto.getSchoolCount() != null) entity.setSchoolCount(dto.getSchoolCount());
        if (dto.getHospitalCount() != null) entity.setHospitalCount(dto.getHospitalCount());
        if (dto.getRailwayCrossingCount() != null) entity.setRailwayCrossingCount(dto.getRailwayCrossingCount());
        if (dto.getBridgeCount() != null) entity.setBridgeCount(dto.getBridgeCount());
        if (dto.getTrafficSignalCount() != null) entity.setTrafficSignalCount(dto.getTrafficSignalCount());
        if (dto.getPedestrianCrossingCount() != null) entity.setPedestrianCrossingCount(dto.getPedestrianCrossingCount());
        if (dto.getCurveCount() != null) entity.setCurveCount(dto.getCurveCount());
        if (dto.getStraightRoadPercentage() != null) entity.setStraightRoadPercentage(BigDecimal.valueOf(dto.getStraightRoadPercentage()));
        if (dto.getNarrowRoadPercentage() != null) entity.setNarrowRoadPercentage(BigDecimal.valueOf(dto.getNarrowRoadPercentage()));
        if (dto.getWideRoadPercentage() != null) entity.setWideRoadPercentage(BigDecimal.valueOf(dto.getWideRoadPercentage()));
        if (dto.getUrbanPercentage() != null) entity.setUrbanPercentage(BigDecimal.valueOf(dto.getUrbanPercentage()));
        if (dto.getRuralPercentage() != null) entity.setRuralPercentage(BigDecimal.valueOf(dto.getRuralPercentage()));
    }

    private RoadEnvironmentFeaturesResponseDto mapToResponse(RoadEnvironmentFeatures entity) {
        RoadEnvironmentFeaturesResponseDto dto = new RoadEnvironmentFeaturesResponseDto();
        dto.setEnvironmentId(entity.getEnvironmentId());
        if (entity.getRoadSegment() != null) {
            dto.setSegmentId(entity.getRoadSegment().getSegmentId());
        }
        dto.setJunctionCount(entity.getJunctionCount());
        dto.setSchoolCount(entity.getSchoolCount());
        dto.setHospitalCount(entity.getHospitalCount());
        dto.setRailwayCrossingCount(entity.getRailwayCrossingCount());
        dto.setBridgeCount(entity.getBridgeCount());
        dto.setTrafficSignalCount(entity.getTrafficSignalCount());
        dto.setPedestrianCrossingCount(entity.getPedestrianCrossingCount());
        dto.setCurveCount(entity.getCurveCount());
        if (entity.getStraightRoadPercentage() != null) dto.setStraightRoadPercentage(entity.getStraightRoadPercentage().doubleValue());
        if (entity.getNarrowRoadPercentage() != null) dto.setNarrowRoadPercentage(entity.getNarrowRoadPercentage().doubleValue());
        if (entity.getWideRoadPercentage() != null) dto.setWideRoadPercentage(entity.getWideRoadPercentage().doubleValue());
        if (entity.getUrbanPercentage() != null) dto.setUrbanPercentage(entity.getUrbanPercentage().doubleValue());
        if (entity.getRuralPercentage() != null) dto.setRuralPercentage(entity.getRuralPercentage().doubleValue());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        return dto;
    }
}
