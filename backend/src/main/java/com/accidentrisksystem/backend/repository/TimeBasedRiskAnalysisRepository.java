package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.TimeBasedRiskAnalysis;
import com.accidentrisksystem.backend.irepository.ITimeBasedRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class TimeBasedRiskAnalysisRepository {

    private final ITimeBasedRiskAnalysisRepository timeBasedRiskAnalysisRepository;

    public TimeBasedRiskAnalysis save(TimeBasedRiskAnalysis analysis) {
        return timeBasedRiskAnalysisRepository.save(analysis);
    }

    public Optional<TimeBasedRiskAnalysis> findById(Long id) {
        return timeBasedRiskAnalysisRepository.findById(id);
    }

    public Page<TimeBasedRiskAnalysis> findAll(Pageable pageable) {
        return timeBasedRiskAnalysisRepository.findAll(pageable);
    }

    public Optional<TimeBasedRiskAnalysis> findByTimeSlot(String timeSlot) {
        return timeBasedRiskAnalysisRepository.findByTimeSlot(timeSlot);
    }

    public void delete(TimeBasedRiskAnalysis analysis) {
        timeBasedRiskAnalysisRepository.delete(analysis);
    }
}