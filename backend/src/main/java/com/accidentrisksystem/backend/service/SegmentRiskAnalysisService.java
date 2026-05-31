package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.SegmentRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.SegmentRiskAnalysisResponseDto;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.entity.SegmentRiskAnalysis;
import com.accidentrisksystem.backend.enums.RiskLevel;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.ISegmentRiskAnalysisService;
import com.accidentrisksystem.backend.repository.AccidentRecordRepository;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import com.accidentrisksystem.backend.repository.SegmentRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SegmentRiskAnalysisService implements ISegmentRiskAnalysisService {

    private final SegmentRiskAnalysisRepository segmentRiskAnalysisRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final AccidentRecordRepository accidentRecordRepository;

    @Override
    public SegmentRiskAnalysisResponseDto create(SegmentRiskAnalysisRequestDto request) {
        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        SegmentRiskAnalysis analysis = new SegmentRiskAnalysis();
        analysis.setRoadSegment(roadSegment);
        analysis.setAccidentCount(request.getAccidentCount());
        analysis.setSegmentRiskLevel(request.getSegmentRiskLevel());
        analysis.setGeneratedAt(LocalDateTime.now());

        return mapToResponse(segmentRiskAnalysisRepository.save(analysis));
    }

    @Override
    public SegmentRiskAnalysisResponseDto update(Long id, SegmentRiskAnalysisRequestDto request) {
        SegmentRiskAnalysis analysis = segmentRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));

        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        analysis.setRoadSegment(roadSegment);
        analysis.setAccidentCount(request.getAccidentCount());
        analysis.setSegmentRiskLevel(request.getSegmentRiskLevel());

        return mapToResponse(segmentRiskAnalysisRepository.save(analysis));
    }

    @Override
    public void delete(Long id) {
        SegmentRiskAnalysis analysis = segmentRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));

        segmentRiskAnalysisRepository.delete(analysis);
    }

    @Override
    public SegmentRiskAnalysisResponseDto getById(Long id) {
        SegmentRiskAnalysis analysis = segmentRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Analysis not found"));

        return mapToResponse(analysis);
    }

    @Override
    public PageResponse<SegmentRiskAnalysisResponseDto> getAll(int page, int size) {
        Page<SegmentRiskAnalysis> pageData =
                segmentRiskAnalysisRepository.findAll(PageRequest.of(page, size));

        List<SegmentRiskAnalysisResponseDto> content = pageData
                .getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return new PageResponse<>(
                content,
                pageData.getNumber(),
                pageData.getSize(),
                pageData.getTotalElements(),
                pageData.getTotalPages(),
                pageData.isLast()
        );
    }

    @Override
    public void generateAnalysis() {
        List<RoadSegment> segments = roadSegmentRepository.findAll();

        for (RoadSegment segment : segments) {

            long count = accidentRecordRepository.countByRoadSegment(segment);

            RiskLevel riskLevel;

            if (count <= 5) {
                riskLevel = RiskLevel.LOW;
            } else if (count <= 10) {
                riskLevel = RiskLevel.MEDIUM;
            } else {
                riskLevel = RiskLevel.HIGH;
            }

            SegmentRiskAnalysis analysis = new SegmentRiskAnalysis();
            analysis.setRoadSegment(segment);
            analysis.setAccidentCount((int) count);
            analysis.setSegmentRiskLevel(riskLevel);
            analysis.setGeneratedAt(LocalDateTime.now());

            segmentRiskAnalysisRepository.save(analysis);
        }
    }

    private SegmentRiskAnalysisResponseDto mapToResponse(SegmentRiskAnalysis analysis) {
        SegmentRiskAnalysisResponseDto response = new SegmentRiskAnalysisResponseDto();
        response.setResultId(analysis.getResultId());
        response.setSegmentId(analysis.getRoadSegment().getSegmentId());
        response.setAccidentCount(analysis.getAccidentCount());
        response.setSegmentRiskLevel(analysis.getSegmentRiskLevel());
        return response;
    }
}