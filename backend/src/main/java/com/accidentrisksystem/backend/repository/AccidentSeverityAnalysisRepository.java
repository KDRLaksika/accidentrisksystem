package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.AccidentSeverityAnalysis;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.irepository.IAccidentSeverityAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AccidentSeverityAnalysisRepository {

    private final IAccidentSeverityAnalysisRepository accidentSeverityAnalysisRepository;

    public AccidentSeverityAnalysis save(AccidentSeverityAnalysis analysis) {
        return accidentSeverityAnalysisRepository.save(analysis);
    }

    public Optional<AccidentSeverityAnalysis> findById(Long id) {
        return accidentSeverityAnalysisRepository.findById(id);
    }

    public Page<AccidentSeverityAnalysis> findAll(Pageable pageable) {
        return accidentSeverityAnalysisRepository.findAll(pageable);
    }

    public List<AccidentSeverityAnalysis> findAll() {
        return accidentSeverityAnalysisRepository.findAll();
    }

    public Optional<AccidentSeverityAnalysis> findByRoadSegment(RoadSegment roadSegment) {
        return accidentSeverityAnalysisRepository.findByRoadSegment(roadSegment);
    }

    public void delete(AccidentSeverityAnalysis analysis) {
        accidentSeverityAnalysisRepository.delete(analysis);
    }
}