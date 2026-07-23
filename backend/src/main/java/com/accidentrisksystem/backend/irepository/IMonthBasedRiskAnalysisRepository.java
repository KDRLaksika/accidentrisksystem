package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.MonthBasedRiskAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IMonthBasedRiskAnalysisRepository extends JpaRepository<MonthBasedRiskAnalysis, Long> {

    Optional<MonthBasedRiskAnalysis> findByMonth(String month);
}
