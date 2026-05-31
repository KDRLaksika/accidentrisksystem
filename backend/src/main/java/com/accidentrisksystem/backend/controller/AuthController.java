package com.accidentrisksystem.backend.controller;

import com.accidentrisksystem.backend.common.ApiResponse;
import com.accidentrisksystem.backend.dto.request.LoginRequestDto;
import com.accidentrisksystem.backend.dto.response.LoginResponseDto;
import com.accidentrisksystem.backend.iservice.IAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponseDto> login(@RequestBody LoginRequestDto request) {
        LoginResponseDto response = authService.login(request);
        return ApiResponse.success("Login successful", response);
    }
}