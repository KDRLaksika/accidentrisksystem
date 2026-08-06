package com.accidentrisksystem.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnvironmentRiskPredictionRequestDto {

    private Integer segmentId;
    private String timeCategory;
}
