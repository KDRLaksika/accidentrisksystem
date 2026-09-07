package com.accidentrisksystem.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class RoadEnvironmentFeaturesResponseDto {

    private Long environmentId;
    private Integer segmentId;
    private Integer junctionCount;
    private Integer schoolCount;
    private Integer hospitalCount;
    private Integer railwayCrossingCount;
    private Integer bridgeCount;
    private Integer trafficSignalCount;
    private Integer pedestrianCrossingCount;
    private Double straightRoadPercentage;
    private Double wideRoadPercentage;
    private Double urbanPercentage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
