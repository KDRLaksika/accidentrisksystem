package com.accidentrisksystem.backend.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "road_environment_features")
public class RoadEnvironmentFeatures {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "environment_id")
    private Long environmentId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id", nullable = false, unique = true)
    private RoadSegment roadSegment;

    @Column(name = "junction_count", nullable = false)
    private Integer junctionCount = 0;

    @Column(name = "school_count", nullable = false)
    private Integer schoolCount = 0;

    @Column(name = "hospital_count", nullable = false)
    private Integer hospitalCount = 0;

    @Column(name = "railway_crossing_count", nullable = false)
    private Integer railwayCrossingCount = 0;

    @Column(name = "bridge_count", nullable = false)
    private Integer bridgeCount = 0;

    @Column(name = "traffic_signal_count", nullable = false)
    private Integer trafficSignalCount = 0;

    @Column(name = "pedestrian_crossing_count", nullable = false)
    private Integer pedestrianCrossingCount = 0;

    @Column(name = "straight_road_percentage", nullable = false)
    private BigDecimal straightRoadPercentage = BigDecimal.ZERO;

    @Column(name = "wide_road_percentage", nullable = false)
    private BigDecimal wideRoadPercentage = BigDecimal.ZERO;

    @Column(name = "urban_percentage", nullable = false)
    private BigDecimal urbanPercentage = BigDecimal.ZERO;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
