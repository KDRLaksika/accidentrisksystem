package com.accidentrisksystem.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SegmentRangeRequestDto {

    private Integer segmentId;
    private Double startKm;
    private Double endKm;
}