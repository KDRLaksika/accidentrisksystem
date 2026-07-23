package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.MonthBasedRiskAnalysis;
import com.accidentrisksystem.backend.irepository.IMonthBasedRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class MonthBasedRiskAnalysisRepository {

    private final IMonthBasedRiskAnalysisRepository monthBasedRiskAnalysisRepository;

    public MonthBasedRiskAnalysis save(MonthBasedRiskAnalysis analysis) {
        return monthBasedRiskAnalysisRepository.save(analysis);
    }

    public Optional<MonthBasedRiskAnalysis> findById(Long id) {
        return monthBasedRiskAnalysisRepository.findById(id);
    }

    public Page<MonthBasedRiskAnalysis> findAll(Pageable pageable) {
        return monthBasedRiskAnalysisRepository.findAll(pageable);
    }

    public List<MonthBasedRiskAnalysis> findAll() {
        return monthBasedRiskAnalysisRepository.findAll();
    }

    public Optional<MonthBasedRiskAnalysis> findByMonth(String month) {
        return monthBasedRiskAnalysisRepository.findByMonth(month);
    }

    public void delete(MonthBasedRiskAnalysis analysis) {
        monthBasedRiskAnalysisRepository.delete(analysis);
    }
}
