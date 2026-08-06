package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.RoadEnvironmentFeaturesRequestDto;
import com.accidentrisksystem.backend.dto.response.RoadEnvironmentFeaturesResponseDto;
import com.accidentrisksystem.backend.iservice.IRoadEnvironmentFeaturesService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/road-environment-features")
@RequiredArgsConstructor
public class RoadEnvironmentFeaturesController {

    private final IRoadEnvironmentFeaturesService environmentService;

    @PostMapping
    public ApiResponse<RoadEnvironmentFeaturesResponseDto> create(
            @RequestBody RoadEnvironmentFeaturesRequestDto request
    ) {
        return ApiResponse.success(
                "Road environment feature record created",
                environmentService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<RoadEnvironmentFeaturesResponseDto> update(
            @PathVariable Long id,
            @RequestBody RoadEnvironmentFeaturesRequestDto request
    ) {
        return ApiResponse.success(
                "Road environment feature record updated",
                environmentService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        environmentService.delete(id);
        return ApiResponse.success("Road environment feature record deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<RoadEnvironmentFeaturesResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Road environment feature record fetched",
                environmentService.getById(id)
        );
    }

    @GetMapping("/segment/{segmentId}")
    public ApiResponse<RoadEnvironmentFeaturesResponseDto> getBySegmentId(@PathVariable Integer segmentId) {
        return ApiResponse.success(
                "Road environment feature record fetched by segment",
                environmentService.getBySegmentId(segmentId)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<RoadEnvironmentFeaturesResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Road environment feature records page",
                environmentService.getAll(page, size)
        );
    }

    @GetMapping("/all")
    public ApiResponse<List<RoadEnvironmentFeaturesResponseDto>> getAllList() {
        return ApiResponse.success(
                "All road environment feature records",
                environmentService.getAllList()
        );
    }
}
