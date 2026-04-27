package com.accidentrisksystem.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoadSegmentResponseDto {

    private Integer segmentId;
    private String geometry; // send as string (GeoJSON or WKT later)
}