package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.SegmentRangeRequestDto;
import com.accidentrisksystem.backend.dto.response.SegmentRangeResponseDto;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.entity.SegmentRange;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.ISegmentRangeService;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import com.accidentrisksystem.backend.repository.SegmentRangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SegmentRangeService implements ISegmentRangeService {

    private final SegmentRangeRepository segmentRangeRepository;
    private final RoadSegmentRepository roadSegmentRepository;

    @Override
    public SegmentRangeResponseDto create(SegmentRangeRequestDto request) {
        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        SegmentRange segmentRange = new SegmentRange();
        segmentRange.setRoadSegment(roadSegment);
        segmentRange.setStartKm(request.getStartKm());
        segmentRange.setEndKm(request.getEndKm());
        segmentRange.setIsActive(true);

        SegmentRange saved = segmentRangeRepository.save(segmentRange);
        return mapToResponse(saved);
    }

    @Override
    public SegmentRangeResponseDto update(Long id, SegmentRangeRequestDto request) {
        SegmentRange segmentRange = segmentRangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segment range not found"));

        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        segmentRange.setRoadSegment(roadSegment);
        segmentRange.setStartKm(request.getStartKm());
        segmentRange.setEndKm(request.getEndKm());

        SegmentRange updated = segmentRangeRepository.save(segmentRange);
        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {
        SegmentRange segmentRange = segmentRangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segment range not found"));

        segmentRangeRepository.delete(segmentRange);
    }

    @Override
    public SegmentRangeResponseDto getById(Long id) {
        SegmentRange segmentRange = segmentRangeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Segment range not found"));

        return mapToResponse(segmentRange);
    }

    @Override
    public PageResponse<SegmentRangeResponseDto> getAll(int page, int size) {
        Page<SegmentRange> segmentRangePage = segmentRangeRepository.findAll(PageRequest.of(page, size));

        List<SegmentRangeResponseDto> content = segmentRangePage
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new PageResponse<>(
                content,
                segmentRangePage.getNumber(),
                segmentRangePage.getSize(),
                segmentRangePage.getTotalElements(),
                segmentRangePage.getTotalPages(),
                segmentRangePage.isLast()
        );
    }

    private SegmentRangeResponseDto mapToResponse(SegmentRange segmentRange) {
        SegmentRangeResponseDto response = new SegmentRangeResponseDto();
        response.setRangeId(segmentRange.getRangeId());
        response.setSegmentId(segmentRange.getRoadSegment().getSegmentId());
        response.setStartKm(segmentRange.getStartKm());
        response.setEndKm(segmentRange.getEndKm());
        return response;
    }
}