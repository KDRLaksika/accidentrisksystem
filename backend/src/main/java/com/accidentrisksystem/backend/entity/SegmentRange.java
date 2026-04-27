package com.accidentrisksystem.backend.entity;

import com.accidentrisksystem.backend.common.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "segment_ranges")
public class SegmentRange extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "range_id")
    private Long rangeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id", nullable = false)
    private RoadSegment roadSegment;

    @Column(name = "start_km", nullable = false)
    private Double startKm;

    @Column(name = "end_km", nullable = false)
    private Double endKm;
}