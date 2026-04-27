package com.accidentrisksystem.backend.dto.request;

import com.accidentrisksystem.backend.enums.TimeCategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PredictionRequestDto {

    private Integer segmentId;
    private TimeCategory timeCategory;
}