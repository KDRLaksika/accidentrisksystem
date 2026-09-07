package com.accidentrisksystem.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WhatIfSimulationRequestDto {

    private Integer segmentId;
    private String timeCategory;

    // Infrastructure Counts
    private Integer junctionCount;
    private Integer schoolCount;
    private Integer hospitalCount;
    private Integer railwayCrossingCount;
    private Integer bridgeCount;
    private Integer trafficSignalCount;
    private Integer pedestrianCrossingCount;

    // Road Width & Environment Percentages
    private Double straightRoadPercentage;
    private Double wideRoadPercentage;
    private Double urbanPercentage;
}
