package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.RoadEnvironmentFeatures;
import com.accidentrisksystem.backend.entity.RoadSegment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface IRoadEnvironmentFeaturesRepository extends JpaRepository<RoadEnvironmentFeatures, Long> {

    Optional<RoadEnvironmentFeatures> findByRoadSegment(RoadSegment roadSegment);

    Optional<RoadEnvironmentFeatures> findByRoadSegment_SegmentId(Integer segmentId);

    boolean existsByRoadSegment_SegmentId(Integer segmentId);
}
