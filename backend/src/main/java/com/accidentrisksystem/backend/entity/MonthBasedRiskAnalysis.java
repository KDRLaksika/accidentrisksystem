package com.accidentrisksystem.backend.entity;

import com.accidentrisksystem.backend.enums.RiskLevel;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "month_based_risk_analysis")
public class MonthBasedRiskAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "result_id")
    private Long resultId;

    @Column(name = "month", nullable = false, length = 30)
    private String month;

    @Column(name = "accident_count", nullable = false)
    private Integer accidentCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "month_risk_level", nullable = false, length = 20)
    private RiskLevel monthRiskLevel;

    @Column(name = "generated_at", nullable = false)
    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.generatedAt == null) {
            this.generatedAt = LocalDateTime.now();
        }
    }
}
