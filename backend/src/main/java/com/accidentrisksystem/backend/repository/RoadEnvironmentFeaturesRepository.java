package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.RoadEnvironmentFeatures;
import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.irepository.IRoadEnvironmentFeaturesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RoadEnvironmentFeaturesRepository {

    private final IRoadEnvironmentFeaturesRepository repository;

    public RoadEnvironmentFeatures save(RoadEnvironmentFeatures features) {
        return repository.save(features);
    }

    public Optional<RoadEnvironmentFeatures> findById(Long id) {
        return repository.findById(id);
    }

    public Optional<RoadEnvironmentFeatures> findByRoadSegment(RoadSegment roadSegment) {
        return repository.findByRoadSegment(roadSegment);
    }

    public Optional<RoadEnvironmentFeatures> findBySegmentId(Integer segmentId) {
        return repository.findByRoadSegment_SegmentId(segmentId);
    }

    public boolean existsBySegmentId(Integer segmentId) {
        return repository.existsByRoadSegment_SegmentId(segmentId);
    }

    public Page<RoadEnvironmentFeatures> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public List<RoadEnvironmentFeatures> findAll() {
        return repository.findAll();
    }

    public void delete(RoadEnvironmentFeatures features) {
        repository.delete(features);
    }
}
