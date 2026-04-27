package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.AccidentRecord;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.enums.SeverityLevel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalTime;
import java.util.List;

public interface IAccidentRecordRepository extends JpaRepository<AccidentRecord, Long> {

    List<AccidentRecord> findByRoadSegment(RoadSegment roadSegment);

    long countByRoadSegment(RoadSegment roadSegment);

    long countByRoadSegmentAndSeverityLevelIn(RoadSegment roadSegment, List<SeverityLevel> levels);

    List<AccidentRecord> findByAccidentTimeBetween(LocalTime start, LocalTime end);
}