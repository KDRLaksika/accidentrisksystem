package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.response.RoadSegmentResponseDto;
import com.accidentrisksystem.backend.iservice.IRoadSegmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/road-segments")
@RequiredArgsConstructor
public class RoadSegmentController {

    private final IRoadSegmentService roadSegmentService;

    @GetMapping("/{id}")
    public ApiResponse<RoadSegmentResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(
                "Road segment fetched",
                roadSegmentService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<RoadSegmentResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Road segments list",
                roadSegmentService.getAll(page, size)
        );
    }

    @GetMapping("/dropdown")
    public ApiResponse<List<?>> getDropdown() {
        return ApiResponse.success(
                "Road segment dropdown",
                roadSegmentService.getDropdown()
        );
    }
}