package com.accidentrisksystem.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoadEnvironmentFeaturesRequestDto {

    private Integer segmentId;
    private Integer junctionCount = 0;
    private Integer schoolCount = 0;
    private Integer hospitalCount = 0;
    private Integer railwayCrossingCount = 0;
    private Integer bridgeCount = 0;
    private Integer trafficSignalCount = 0;
    private Integer pedestrianCrossingCount = 0;
    private Double straightRoadPercentage = 0.00;
    private Double wideRoadPercentage = 0.00;
    private Double urbanPercentage = 0.00;
}
