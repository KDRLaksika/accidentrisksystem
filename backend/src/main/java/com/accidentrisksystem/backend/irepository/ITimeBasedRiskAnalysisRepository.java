package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.TimeBasedRiskAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ITimeBasedRiskAnalysisRepository extends JpaRepository<TimeBasedRiskAnalysis, Long> {

    Optional<TimeBasedRiskAnalysis> findByTimeSlot(String timeSlot);
}