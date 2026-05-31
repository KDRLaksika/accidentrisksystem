package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.AccidentRecord;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.enums.SeverityLevel;
import com.accidentrisksystem.backend.irepository.IAccidentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AccidentRecordRepository {

    private final IAccidentRecordRepository accidentRecordRepository;

    public AccidentRecord save(AccidentRecord accidentRecord) {
        return accidentRecordRepository.save(accidentRecord);
    }

    public Optional<AccidentRecord> findById(Long id) {
        return accidentRecordRepository.findById(id);
    }

    public Page<AccidentRecord> findAll(Pageable pageable) {
        return accidentRecordRepository.findAll(pageable);
    }

    public List<AccidentRecord> findAll() {
        return accidentRecordRepository.findAll();
    }

    public void delete(AccidentRecord accidentRecord) {
        accidentRecordRepository.delete(accidentRecord);
    }

    public long countByRoadSegment(RoadSegment roadSegment) {
        return accidentRecordRepository.countByRoadSegment(roadSegment);
    }

    public long countByRoadSegmentAndSeverityLevelIn(
            RoadSegment roadSegment,
            List<SeverityLevel> levels
    ) {
        return accidentRecordRepository.countByRoadSegmentAndSeverityLevelIn(roadSegment, levels);
    }

    public List<AccidentRecord> findByAccidentTimeBetween(LocalTime start, LocalTime end) {
        return accidentRecordRepository.findByAccidentTimeBetween(start, end);
    }
}