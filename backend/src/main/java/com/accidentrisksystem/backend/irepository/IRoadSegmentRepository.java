package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.RoadSegment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IRoadSegmentRepository extends JpaRepository<RoadSegment, Integer> {
}