package com.accidentrisksystem.backend.irepository;

import com.accidentrisksystem.backend.entity.SegmentRange;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ISegmentRangeRepository extends JpaRepository<SegmentRange, Long> {

    Optional<SegmentRange> findByStartKmLessThanEqualAndEndKmGreaterThan(Double startMarker, Double endMarker);
}