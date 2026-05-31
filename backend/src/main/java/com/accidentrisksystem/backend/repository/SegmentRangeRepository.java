package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.SegmentRange;
import com.accidentrisksystem.backend.irepository.ISegmentRangeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SegmentRangeRepository {

    private final ISegmentRangeRepository segmentRangeRepository;

    public SegmentRange save(SegmentRange segmentRange) {
        return segmentRangeRepository.save(segmentRange);
    }

    public Optional<SegmentRange> findById(Long id) {
        return segmentRangeRepository.findById(id);
    }

    public Page<SegmentRange> findAll(Pageable pageable) {
        return segmentRangeRepository.findAll(pageable);
    }

    public void delete(SegmentRange segmentRange) {
        segmentRangeRepository.delete(segmentRange);
    }

    public Optional<SegmentRange> findByKmMarker(Double marker) {
        return segmentRangeRepository
                .findByStartKmLessThanEqualAndEndKmGreaterThan(marker, marker);
    }
}