package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.SegmentRangeRequestDto;
import com.accidentrisksystem.backend.dto.response.SegmentRangeResponseDto;
import com.accidentrisksystem.backend.iservice.ISegmentRangeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/segment-ranges")
@RequiredArgsConstructor
public class SegmentRangeController {

    private final ISegmentRangeService segmentRangeService;

    @PostMapping
    public ApiResponse<SegmentRangeResponseDto> create(@RequestBody SegmentRangeRequestDto request) {
        return ApiResponse.success(
                "Segment range created",
                segmentRangeService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<SegmentRangeResponseDto> update(
            @PathVariable Long id,
            @RequestBody SegmentRangeRequestDto request
    ) {
        return ApiResponse.success(
                "Segment range updated",
                segmentRangeService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        segmentRangeService.delete(id);
        return ApiResponse.success("Segment range deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<SegmentRangeResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Segment range fetched",
                segmentRangeService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<SegmentRangeResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Segment ranges list",
                segmentRangeService.getAll(page, size)
        );
    }
}