package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.DropdownDto;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.response.RoadSegmentResponseDto;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IRoadSegmentService;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadSegmentService implements IRoadSegmentService {

    private final RoadSegmentRepository roadSegmentRepository;

    @Override
    public RoadSegmentResponseDto getById(Integer id) {
        RoadSegment roadSegment = roadSegmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        return mapToResponse(roadSegment);
    }

    @Override
    public PageResponse<RoadSegmentResponseDto> getAll(int page, int size) {
        Page<RoadSegment> roadSegmentPage = roadSegmentRepository.findAll(PageRequest.of(page, size));

        List<RoadSegmentResponseDto> content = roadSegmentPage
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new PageResponse<>(
                content,
                roadSegmentPage.getNumber(),
                roadSegmentPage.getSize(),
                roadSegmentPage.getTotalElements(),
                roadSegmentPage.getTotalPages(),
                roadSegmentPage.isLast()
        );
    }

    @Override
    public List<?> getDropdown() {
        return roadSegmentRepository.findAll()
                .stream()
                .map(segment -> new DropdownDto(
                        segment.getSegmentId(),
                        "Segment " + segment.getSegmentId()
                ))
                .toList();
    }

    private RoadSegmentResponseDto mapToResponse(RoadSegment roadSegment) {
        RoadSegmentResponseDto response = new RoadSegmentResponseDto();
        response.setSegmentId(roadSegment.getSegmentId());

        if (roadSegment.getGeometry() != null) {
            response.setGeometry(roadSegment.getGeometry().toText());
        }

        return response;
    }
}