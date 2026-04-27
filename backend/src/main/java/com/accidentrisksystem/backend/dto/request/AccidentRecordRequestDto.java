package com.accidentrisksystem.backend.dto.request;

import com.accidentrisksystem.backend.enums.SeverityLevel;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AccidentRecordRequestDto {

    private Integer segmentId;
    private LocalDate accidentDate;
    private LocalTime accidentTime;
    private Double nearestKmMarker;
    private SeverityLevel severityLevel;
}