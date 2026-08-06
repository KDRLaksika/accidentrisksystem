package com.accidentrisksystem.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EnvironmentRiskPredictionRequestDto {

    private Integer segmentId;
    private String timeCategory;
}
