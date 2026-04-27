package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.SegmentRiskAnalysis;
import com.accidentrisksystem.backend.entity.RoadSegment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ISegmentRiskAnalysisRepository extends JpaRepository<SegmentRiskAnalysis, Long> {

    Optional<SegmentRiskAnalysis> findByRoadSegment(RoadSegment roadSegment);
}