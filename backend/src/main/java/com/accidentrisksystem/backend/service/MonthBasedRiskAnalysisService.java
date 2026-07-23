package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.common.DropdownDto;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.MonthBasedRiskAnalysisRequestDto;
import com.accidentrisksystem.backend.dto.response.MonthBasedRiskAnalysisResponseDto;
import com.accidentrisksystem.backend.entity.AccidentRecord;
import com.accidentrisksystem.backend.entity.MonthBasedRiskAnalysis;
import com.accidentrisksystem.backend.enums.RiskLevel;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.iservice.IMonthBasedRiskAnalysisService;
import com.accidentrisksystem.backend.repository.AccidentRecordRepository;
import com.accidentrisksystem.backend.repository.MonthBasedRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonthBasedRiskAnalysisService implements IMonthBasedRiskAnalysisService {

    private final MonthBasedRiskAnalysisRepository monthBasedRiskAnalysisRepository;
    private final AccidentRecordRepository accidentRecordRepository;

    @Override
    public MonthBasedRiskAnalysisResponseDto create(MonthBasedRiskAnalysisRequestDto request) {
        MonthBasedRiskAnalysis analysis = new MonthBasedRiskAnalysis();
        analysis.setMonth(request.getMonth());
        analysis.setAccidentCount(request.getAccidentCount());
        analysis.setMonthRiskLevel(request.getMonthRiskLevel());
        analysis.setGeneratedAt(LocalDateTime.now());

        return mapToResponse(monthBasedRiskAnalysisRepository.save(analysis));
    }

    @Override
    public MonthBasedRiskAnalysisResponseDto update(Long id, MonthBasedRiskAnalysisRequestDto request) {
        MonthBasedRiskAnalysis analysis = monthBasedRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Month-based risk analysis not found"));

        analysis.setMonth(request.getMonth());
        analysis.setAccidentCount(request.getAccidentCount());
        analysis.setMonthRiskLevel(request.getMonthRiskLevel());

        return mapToResponse(monthBasedRiskAnalysisRepository.save(analysis));
    }

    @Override
    public void delete(Long id) {
        MonthBasedRiskAnalysis analysis = monthBasedRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Month-based risk analysis not found"));

        monthBasedRiskAnalysisRepository.delete(analysis);
    }

    @Override
    public MonthBasedRiskAnalysisResponseDto getById(Long id) {
        MonthBasedRiskAnalysis analysis = monthBasedRiskAnalysisRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Month-based risk analysis not found"));

        return mapToResponse(analysis);
    }

    @Override
    public PageResponse<MonthBasedRiskAnalysisResponseDto> getAll(int page, int size) {
        Page<MonthBasedRiskAnalysis> pageData =
                monthBasedRiskAnalysisRepository.findAll(PageRequest.of(page, size));

        List<MonthBasedRiskAnalysisResponseDto> content = pageData
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
        List<AccidentRecord> allRecords = accidentRecordRepository.findAll();

        Map<String, Long> countByMonth = allRecords.stream()
                .collect(Collectors.groupingBy(
                        record -> record.getAccidentDate().getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH),
                        Collectors.counting()
                ));

        for (Month monthEnum : Month.values()) {
            String monthName = monthEnum.getDisplayName(TextStyle.FULL, Locale.ENGLISH);
            int count = countByMonth.getOrDefault(monthName, 0L).intValue();
            RiskLevel riskLevel = calculateRiskLevel(count);

            MonthBasedRiskAnalysis analysis = monthBasedRiskAnalysisRepository.findByMonth(monthName)
                    .orElse(new MonthBasedRiskAnalysis());

            analysis.setMonth(monthName);
            analysis.setAccidentCount(count);
            analysis.setMonthRiskLevel(riskLevel);
            analysis.setGeneratedAt(LocalDateTime.now());

            monthBasedRiskAnalysisRepository.save(analysis);
        }
    }

    @Override
    public List<?> getMonthDropdown() {
        return Arrays.stream(Month.values())
                .map(m -> new DropdownDto(
                        m.getValue(),
                        m.getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                ))
                .toList();
    }

    private RiskLevel calculateRiskLevel(int accidentCount) {
        if (accidentCount > 60) {
            return RiskLevel.HIGH;
        } else if (accidentCount >= 40) {
            return RiskLevel.MEDIUM;
        } else {
            return RiskLevel.LOW;
        }
    }

    private MonthBasedRiskAnalysisResponseDto mapToResponse(MonthBasedRiskAnalysis analysis) {
        MonthBasedRiskAnalysisResponseDto response = new MonthBasedRiskAnalysisResponseDto();
        response.setResultId(analysis.getResultId());
        response.setMonth(analysis.getMonth());
        response.setAccidentCount(analysis.getAccidentCount());
        response.setMonthRiskLevel(analysis.getMonthRiskLevel());
        return response;
    }
}
