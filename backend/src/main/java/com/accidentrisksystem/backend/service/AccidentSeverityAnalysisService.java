package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.AccidentSeverityAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.AccidentSeverityAnalysisResponseDto;
import com.accidentrisksystem.backend.entity.AccidentSeverityAnalysis;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.enums.RiskLevel;
import com.accidentrisksystem.backend.enums.SeverityLevel;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IAccidentSeverityAnalysisService;
import com.accidentrisksystem.backend.repository.AccidentRecordRepository;
import com.accidentrisksystem.backend.repository.AccidentSeverityAnalysisRepository;
import com.accidentrisksystem.backend.repository.RoadSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccidentSeverityAnalysisService implements IAccidentSeverityAnalysisService {

    private final AccidentSeverityAnalysisRepository accidentSeverityAnalysisRepository;
    private final RoadSegmentRepository roadSegmentRepository;
    private final AccidentRecordRepository accidentRecordRepository;

    @Override
    public AccidentSeverityAnalysisResponseDto create(AccidentSeverityAnalysisRequestDto request) {
        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        AccidentSeverityAnalysis analysis = new AccidentSeverityAnalysis();
        analysis.setRoadSegment(roadSegment);
        analysis.setFatalCount(request.getFatalCount());
        analysis.setSeriousCount(request.getSeriousCount());
        analysis.setSegmentRiskLevel(request.getSegmentRiskLevel());
        analysis.setGeneratedAt(LocalDateTime.now());

        return mapToResponse(accidentSeverityAnalysisRepository.save(analysis));
    }

    @Override
    public AccidentSeverityAnalysisResponseDto update(Long id, AccidentSeverityAnalysisRequestDto request) {
        AccidentSeverityAnalysis analysis = accidentSeverityAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Severity analysis not found"));

        RoadSegment roadSegment = roadSegmentRepository.findById(request.getSegmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Road segment not found"));

        analysis.setRoadSegment(roadSegment);
        analysis.setFatalCount(request.getFatalCount());
        analysis.setSeriousCount(request.getSeriousCount());
        analysis.setSegmentRiskLevel(request.getSegmentRiskLevel());

        return mapToResponse(accidentSeverityAnalysisRepository.save(analysis));
    }

    @Override
    public void delete(Long id) {
        AccidentSeverityAnalysis analysis = accidentSeverityAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Severity analysis not found"));

        accidentSeverityAnalysisRepository.delete(analysis);
    }

    @Override
    public AccidentSeverityAnalysisResponseDto getById(Long id) {
        AccidentSeverityAnalysis analysis = accidentSeverityAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Severity analysis not found"));

        return mapToResponse(analysis);
    }

    @Override
    public PageResponse<AccidentSeverityAnalysisResponseDto> getAll(int page, int size) {
        Page<AccidentSeverityAnalysis> pageData =
                accidentSeverityAnalysisRepository.findAll(PageRequest.of(page, size));

        List<AccidentSeverityAnalysisResponseDto> content = pageData
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

            long fatalCount = accidentRecordRepository.countByRoadSegmentAndSeverityLevelIn(
                    segment,
                    List.of(SeverityLevel.FATAL)
            );

            long seriousCount = accidentRecordRepository.countByRoadSegmentAndSeverityLevelIn(
                    segment,
                    List.of(SeverityLevel.SERIOUS)
            );

            long severeAccidentCount = fatalCount + seriousCount;

            RiskLevel riskLevel;

            if (severeAccidentCount <= 2) {
                riskLevel = RiskLevel.LOW;
            } else if (severeAccidentCount <= 5) {
                riskLevel = RiskLevel.MEDIUM;
            } else {
                riskLevel = RiskLevel.HIGH;
            }

            AccidentSeverityAnalysis analysis = new AccidentSeverityAnalysis();
            analysis.setRoadSegment(segment);
            analysis.setFatalCount((int) fatalCount);
            analysis.setSeriousCount((int) seriousCount);
            analysis.setSegmentRiskLevel(riskLevel);
            analysis.setGeneratedAt(LocalDateTime.now());

            accidentSeverityAnalysisRepository.save(analysis);
        }
    }

    private AccidentSeverityAnalysisResponseDto mapToResponse(AccidentSeverityAnalysis analysis) {
        AccidentSeverityAnalysisResponseDto response = new AccidentSeverityAnalysisResponseDto();
        response.setResultId(analysis.getResultId());
        response.setSegmentId(analysis.getRoadSegment().getSegmentId());
        response.setFatalCount(analysis.getFatalCount());
        response.setSeriousCount(analysis.getSeriousCount());
        response.setSegmentRiskLevel(analysis.getSegmentRiskLevel());
        return response;
    }
}