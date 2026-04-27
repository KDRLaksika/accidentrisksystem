package com.accidentrisksystem.backend.iservice;

import com.accidentrisksystem.backend.dto.request.LoginRequestDto;
import com.accidentrisksystem.backend.dto.response.LoginResponseDto;

public interface IAuthService {

    LoginResponseDto login(LoginRequestDto request);
}