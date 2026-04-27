package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.dto.request.AdminRequestDto;
import com.accidentrisksystem.backend.dto.request.ChangePasswordRequestDto;
import com.accidentrisksystem.backend.dto.response.AdminResponseDto;

public interface IAdminService {

    AdminResponseDto createAdmin(AdminRequestDto request);

    AdminResponseDto getAdminProfile();

    void changePassword(ChangePasswordRequestDto request);
}