package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.AccidentSeverityAnalysis;
import com.accidentrisksystem.backend.entity.RoadSegment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IAccidentSeverityAnalysisRepository extends JpaRepository<AccidentSeverityAnalysis, Long> {

    Optional<AccidentSeverityAnalysis> findByRoadSegment(RoadSegment roadSegment);
}