package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.RoadSegment;
import com.accidentrisksystem.backend.irepository.IRoadSegmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RoadSegmentRepository {

    private final IRoadSegmentRepository roadSegmentRepository;

    public Optional<RoadSegment> findById(Integer id) {
        return roadSegmentRepository.findById(id);
    }

    public Page<RoadSegment> findAll(Pageable pageable) {
        return roadSegmentRepository.findAll(pageable);
    }

    public List<RoadSegment> findAll() {
        return roadSegmentRepository.findAll();
    }

    public boolean existsById(Integer id) {
        return roadSegmentRepository.existsById(id);
    }
}