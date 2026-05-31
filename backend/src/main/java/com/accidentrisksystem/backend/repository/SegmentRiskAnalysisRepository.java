package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.entity.SegmentRiskAnalysis;
import com.accidentrisksystem.backend.irepository.ISegmentRiskAnalysisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SegmentRiskAnalysisRepository {

    private final ISegmentRiskAnalysisRepository segmentRiskAnalysisRepository;

    public SegmentRiskAnalysis save(SegmentRiskAnalysis analysis) {
        return segmentRiskAnalysisRepository.save(analysis);
    }

    public Optional<SegmentRiskAnalysis> findById(Long id) {
        return segmentRiskAnalysisRepository.findById(id);
    }

    public Page<SegmentRiskAnalysis> findAll(Pageable pageable) {
        return segmentRiskAnalysisRepository.findAll(pageable);
    }

    public List<SegmentRiskAnalysis> findAll() {
        return segmentRiskAnalysisRepository.findAll();
    }

    public Optional<SegmentRiskAnalysis> findByRoadSegment(RoadSegment roadSegment) {
        return segmentRiskAnalysisRepository.findByRoadSegment(roadSegment);
    }

    public void delete(SegmentRiskAnalysis analysis) {
        segmentRiskAnalysisRepository.delete(analysis);
    }
}