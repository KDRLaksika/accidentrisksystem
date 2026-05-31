package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.DropdownDto;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.AccidentRecordRequestDto;
import com.accidentrisksystem.backend.dto.response.AccidentRecordResponseDto;
import com.accidentrisksystem.backend.entity.AccidentRecord;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.entity.SegmentRange;
import com.accidentrisksystem.backend.enums.SeverityLevel;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IAccidentRecordService;
import com.accidentrisksystem.backend.repository.AccidentRecordRepository;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import com.accidentrisksystem.backend.repository.SegmentRangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccidentRecordService implements IAccidentRecordService {

    private final AccidentRecordRepository accidentRecordRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final SegmentRangeRepository segmentRangeRepository;

    @Override
    public AccidentRecordResponseDto create(AccidentRecordRequestDto request) {
        RoadSegment roadSegment = resolveRoadSegment(request);

        AccidentRecord accidentRecord = new AccidentRecord();
        accidentRecord.setRoadSegment(roadSegment);
        accidentRecord.setAccidentDate(request.getAccidentDate());
        accidentRecord.setAccidentTime(request.getAccidentTime());
        accidentRecord.setNearestKmMarker(request.getNearestKmMarker());
        accidentRecord.setSeverityLevel(request.getSeverityLevel());
        accidentRecord.setIsActive(true);

        AccidentRecord saved = accidentRecordRepository.save(accidentRecord);
        return mapToResponse(saved);
    }

    @Override
    public AccidentRecordResponseDto update(Long id, AccidentRecordRequestDto request) {
        AccidentRecord accidentRecord = accidentRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accident record not found"));

        RoadSegment roadSegment = resolveRoadSegment(request);

        accidentRecord.setRoadSegment(roadSegment);
        accidentRecord.setAccidentDate(request.getAccidentDate());
        accidentRecord.setAccidentTime(request.getAccidentTime());
        accidentRecord.setNearestKmMarker(request.getNearestKmMarker());
        accidentRecord.setSeverityLevel(request.getSeverityLevel());

        AccidentRecord updated = accidentRecordRepository.save(accidentRecord);
        return mapToResponse(updated);
    }

    @Override
    public void delete(Long id) {
        AccidentRecord accidentRecord = accidentRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accident record not found"));

        accidentRecordRepository.delete(accidentRecord);
    }

    @Override
    public AccidentRecordResponseDto getById(Long id) {
        AccidentRecord accidentRecord = accidentRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accident record not found"));

        return mapToResponse(accidentRecord);
    }

    @Override
    public PageResponse<AccidentRecordResponseDto> getAll(int page, int size) {
        Page<AccidentRecord> accidentRecordPage =
                accidentRecordRepository.findAll(PageRequest.of(page, size));

        List<AccidentRecordResponseDto> content = accidentRecordPage
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new PageResponse<>(
                content,
                accidentRecordPage.getNumber(),
                accidentRecordPage.getSize(),
                accidentRecordPage.getTotalElements(),
                accidentRecordPage.getTotalPages(),
                accidentRecordPage.isLast()
        );
    }

    @Override
    public List<?> getSeverityDropdown() {
        return Arrays.stream(SeverityLevel.values())
                .map(level -> new DropdownDto(
                        level.ordinal() + 1,
                        level.name()
                ))
                .toList();
    }

    @Override
    public List<?> getSegmentDropdown() {
        return roadSegmentRepository.findAll()
                .stream()
                .map(segment -> new DropdownDto(
                        segment.getSegmentId(),
                        "Segment " + segment.getSegmentId()
                ))
                .toList();
    }

    private RoadSegment resolveRoadSegment(AccidentRecordRequestDto request) {
        if (request.getSegmentId() != null) {
            return roadSegmentRepository.findById(request.getSegmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));
        }

        SegmentRange segmentRange = segmentRangeRepository.findByKmMarker(request.getNearestKmMarker())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No segment range found for km marker: " + request.getNearestKmMarker()
                ));

        return segmentRange.getRoadSegment();
    }

    private AccidentRecordResponseDto mapToResponse(AccidentRecord accidentRecord) {
        AccidentRecordResponseDto response = new AccidentRecordResponseDto();
        response.setAccidentId(accidentRecord.getAccidentId());
        response.setSegmentId(accidentRecord.getRoadSegment().getSegmentId());
        response.setAccidentDate(accidentRecord.getAccidentDate());
        response.setAccidentTime(accidentRecord.getAccidentTime());
        response.setNearestKmMarker(accidentRecord.getNearestKmMarker());
        response.setSeverityLevel(accidentRecord.getSeverityLevel());
        return response;
    }
}