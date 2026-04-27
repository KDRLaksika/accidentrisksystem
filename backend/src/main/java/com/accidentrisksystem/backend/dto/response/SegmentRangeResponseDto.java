package com.accidentrisksystem.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SegmentRangeResponseDto {

    private Long rangeId;
    private Integer segmentId;
    private Double startKm;
    private Double endKm;
}