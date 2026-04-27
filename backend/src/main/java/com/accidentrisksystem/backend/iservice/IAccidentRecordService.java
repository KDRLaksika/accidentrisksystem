package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.common.PageResponse;
import com.accidentrisksystem.backend.dto.request.AccidentRecordRequestDto;
import com.accidentrisksystem.backend.dto.response.AccidentRecordResponseDto;

import java.util.List;

public interface IAccidentRecordService {

    AccidentRecordResponseDto create(AccidentRecordRequestDto request);

    AccidentRecordResponseDto update(Long id, AccidentRecordRequestDto request);

    void delete(Long id);

    AccidentRecordResponseDto getById(Long id);

    PageResponse<AccidentRecordResponseDto> getAll(int page, int size);

    List<?> getSeverityDropdown();

    List<?> getSegmentDropdown();
}