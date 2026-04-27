package com.accidentrisksystem.backend.entity;

import com.accidentrisksystem.backend.common.BaseEntity;
import com.accidentrisksystem.backend.enums.SeverityLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "accident_records")
public class AccidentRecord extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accident_id")
    private Long accidentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id", nullable = false)
    private RoadSegment roadSegment;

    @Column(name = "accident_date", nullable = false)
    private LocalDate accidentDate;

    @Column(name = "accident_time", nullable = false)
    private LocalTime accidentTime;

    @Column(name = "nearest_km_marker", nullable = false)
    private Double nearestKmMarker;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity_level", nullable = false, length = 20)
    private SeverityLevel severityLevel;
}