package com.accidentrisksystem.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ShapExplanationDto {

    private String feature;
    private Object value;
    private Double shapValue;
    private String explanation;
}
