package com.accidentrisksystem.backend.entity;

import com.accidentrisksystem.backend.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "accident_severity_analysis")
public class AccidentSeverityAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "segment_id", nullable = false)
    private RoadSegment roadSegment;

    @Column(name = "fatal_count", nullable = false)
    private Integer fatalCount;

    @Column(name = "serious_count", nullable = false)
    private Integer seriousCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "segment_risk_level", nullable = false, length = 20)
    private RiskLevel segmentRiskLevel;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.generatedAt == null) {
            this.generatedAt = LocalDateTime.now();
        }
    }
}