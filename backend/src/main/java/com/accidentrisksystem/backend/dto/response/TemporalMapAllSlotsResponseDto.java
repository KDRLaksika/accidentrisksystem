package com.accidentrisksystem.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TemporalMapAllSlotsResponseDto {

    private Map<String, List<TemporalMapSegmentResponseDto>> timeSlotMap;
}
