package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.dto.request.LoginRequestDto;
import com.accidentrisksystem.backend.dto.response.LoginResponseDto;
import com.accidentrisksystem.backend.entity.Admin;
import com.accidentrisksystem.backend.exception.UnauthorizedException;
import com.accidentrisksystem.backend.irepository.IAdminRepository;
import com.accidentrisksystem.backend.iservice.IAuthService;
import com.accidentrisksystem.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final IAdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public LoginResponseDto login(LoginRequestDto request) {
        Admin admin = adminRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        if (!admin.getIsActive()) {
            throw new UnauthorizedException("Admin account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPasswordHash())) {
            throw new UnauthorizedException("Invalid username or password");
        }

        String token = jwtService.generateToken(admin.getUsername());
        return new LoginResponseDto(token);
    }
}