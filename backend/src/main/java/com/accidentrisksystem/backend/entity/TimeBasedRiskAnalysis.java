package com.accidentrisksystem.backend.entity;

import com.accidentrisksystem.backend.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "time_based_risk_analysis")
public class TimeBasedRiskAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @Column(name = "time_slot", nullable = false, length = 30)
    private String timeSlot;

    @Column(name = "accident_count", nullable = false)
    private Integer accidentCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "time_risk_level", nullable = false, length = 20)
    private RiskLevel timeRiskLevel;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.generatedAt == null) {
            this.generatedAt = LocalDateTime.now();
        }
    }
}