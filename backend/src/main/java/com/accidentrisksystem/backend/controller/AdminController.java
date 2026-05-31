package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.dto.request.AdminRequestDto;
import com.accidentrisksystem.backend.dto.request.ChangePasswordRequestDto;
import com.accidentrisksystem.backend.dto.response.AdminResponseDto;
import com.accidentrisksystem.backend.iservice.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IAdminService adminService;

    @PostMapping("/create")
    public ApiResponse<AdminResponseDto> createAdmin(@RequestBody AdminRequestDto request) {
        AdminResponseDto response = adminService.createAdmin(request);
        return ApiResponse.success("Admin created successfully", response);
    }

    @GetMapping("/profile")
    public ApiResponse<AdminResponseDto> getProfile() {
        AdminResponseDto response = adminService.getAdminProfile();
        return ApiResponse.success("Admin profile fetched", response);
    }

    @PutMapping("/change-password")
    public ApiResponse<Void> changePassword(@RequestBody ChangePasswordRequestDto request) {
        adminService.changePassword(request);
        return ApiResponse.success("Password changed successfully", null);
    }
}