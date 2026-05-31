package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.AccidentRecordRequestDto;
import com.accidentrisksystem.backend.dto.response.AccidentRecordResponseDto;
import com.accidentrisksystem.backend.iservice.IAccidentRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accident-records")
@RequiredArgsConstructor
public class AccidentRecordController {

    private final IAccidentRecordService accidentRecordService;

    @PostMapping
    public ApiResponse<AccidentRecordResponseDto> create(
            @RequestBody AccidentRecordRequestDto request
    ) {
        return ApiResponse.success(
                "Accident record created",
                accidentRecordService.create(request)
        );
    }

    @PutMapping("/{id}")
    public ApiResponse<AccidentRecordResponseDto> update(
            @PathVariable Long id,
            @RequestBody AccidentRecordRequestDto request
    ) {
        return ApiResponse.success(
                "Accident record updated",
                accidentRecordService.update(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        accidentRecordService.delete(id);
        return ApiResponse.success("Accident record deleted", null);
    }

    @GetMapping("/{id}")
    public ApiResponse<AccidentRecordResponseDto> getById(@PathVariable Long id) {
        return ApiResponse.success(
                "Accident record fetched",
                accidentRecordService.getById(id)
        );
    }

    @GetMapping
    public ApiResponse<PageResponse<AccidentRecordResponseDto>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ApiResponse.success(
                "Accident records list",
                accidentRecordService.getAll(page, size)
        );
    }

    @GetMapping("/dropdown/severity")
    public ApiResponse<List<?>> getSeverityDropdown() {
        return ApiResponse.success(
                "Severity dropdown",
                accidentRecordService.getSeverityDropdown()
        );
    }

    @GetMapping("/dropdown/segment")
    public ApiResponse<List<?>> getSegmentDropdown() {
        return ApiResponse.success(
                "Segment dropdown",
                accidentRecordService.getSegmentDropdown()
        );
    }
}