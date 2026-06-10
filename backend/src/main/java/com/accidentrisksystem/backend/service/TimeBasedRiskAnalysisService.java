package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.DropdownDto;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.TimeBasedRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.TimeBasedRiskAnalysisResponseDto;
import com.accidentrisksystem.backend.entity.AccidentRecord;
import com.accidentrisksystem.backend.entity.TimeBasedRiskAnalysis;
import com.accidentrisksystem.backend.enums.RiskLevel;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.ITimeBasedRiskAnalysisService;
import com.accidentrisksystem.backend.repository.AccidentRecordRepository;
import com.accidentrisksystem.backend.repository.TimeBasedRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class TimeBasedRiskAnalysisService implements ITimeBasedRiskAnalysisService {

    private final TimeBasedRiskAnalysisRepository timeBasedRiskAnalysisRepository;
    private final AccidentRecordRepository accidentRecordRepository;

    @Override
    public TimeBasedRiskAnalysisResponseDto create(TimeBasedRiskAnalysisRequestDto request) {
        TimeBasedRiskAnalysis analysis = new TimeBasedRiskAnalysis();
        analysis.setTimeSlot(request.getTimeSlot());
        analysis.setAccidentCount(request.getAccidentCount());
        analysis.setTimeRiskLevel(request.getTimeRiskLevel());
        analysis.setGeneratedAt(LocalDateTime.now());

        return mapToResponse(timeBasedRiskAnalysisRepository.save(analysis));
    }

    @Override
    public TimeBasedRiskAnalysisResponseDto update(Long id, TimeBasedRiskAnalysisRequestDto request) {
        TimeBasedRiskAnalysis analysis = timeBasedRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time-based risk analysis not found"));

        analysis.setTimeSlot(request.getTimeSlot());
        analysis.setAccidentCount(request.getAccidentCount());
        analysis.setTimeRiskLevel(request.getTimeRiskLevel());

        return mapToResponse(timeBasedRiskAnalysisRepository.save(analysis));
    }

    @Override
    public void delete(Long id) {
        TimeBasedRiskAnalysis analysis = timeBasedRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time-based risk analysis not found"));

        timeBasedRiskAnalysisRepository.delete(analysis);
    }

    @Override
    public TimeBasedRiskAnalysisResponseDto getById(Long id) {
        TimeBasedRiskAnalysis analysis = timeBasedRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Time-based risk analysis not found"));

        return mapToResponse(analysis);
    }

    @Override
    public PageResponse<TimeBasedRiskAnalysisResponseDto> getAll(int page, int size) {
        Page<TimeBasedRiskAnalysis> pageData =
                timeBasedRiskAnalysisRepository.findAll(PageRequest.of(page, size));

        List<TimeBasedRiskAnalysisResponseDto> content = pageData
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
        for (int hour = 0; hour < 24; hour++) {
            LocalTime start = LocalTime.of(hour, 0);
            LocalTime end = hour == 23 ? LocalTime.of(23, 59, 59) : LocalTime.of(hour + 1, 0);

            List<AccidentRecord> records = accidentRecordRepository.findByAccidentTimeBetween(start, end);
            int accidentCount = records.size();

            RiskLevel riskLevel = calculateRiskLevel(accidentCount);

            TimeBasedRiskAnalysis analysis = new TimeBasedRiskAnalysis();
            analysis.setTimeSlot(formatTimeSlot(hour));
            analysis.setAccidentCount(accidentCount);
            analysis.setTimeRiskLevel(riskLevel);
            analysis.setGeneratedAt(LocalDateTime.now());

            timeBasedRiskAnalysisRepository.save(analysis);
        }
    }

    @Override
    public List<?> getTimeSlotDropdown() {
        return IntStream.range(0, 24)
                .mapToObj(hour -> new DropdownDto(
                        hour + 1,
                        formatTimeSlot(hour)
                ))
                .toList();
    }

    private RiskLevel calculateRiskLevel(int accidentCount) {
        if (accidentCount <= 26) {
            return RiskLevel.LOW;
        } else if (accidentCount <= 39) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.HIGH;
        }
    }

    private String formatTimeSlot(int hour) {
        int nextHour = (hour + 1) % 24;

        return String.format(
                "%02d:00-%02d:00",
                hour,
                nextHour
        );
    }

    private TimeBasedRiskAnalysisResponseDto mapToResponse(TimeBasedRiskAnalysis analysis) {
        TimeBasedRiskAnalysisResponseDto response = new TimeBasedRiskAnalysisResponseDto();
        response.setResultId(analysis.getResultId());
        response.setTimeSlot(analysis.getTimeSlot());
        response.setAccidentCount(analysis.getAccidentCount());
        response.setTimeRiskLevel(analysis.getTimeRiskLevel());
        return response;
    }
}