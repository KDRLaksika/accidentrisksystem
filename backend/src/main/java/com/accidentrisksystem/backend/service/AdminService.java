package com.accidentrisksystem.backend.service;

import com.accidentrisksystem.backend.dto.request.AdminRequestDto;
import com.accidentrisksystem.backend.dto.request.ChangePasswordRequestDto;
import com.accidentrisksystem.backend.dto.response.AdminResponseDto;
import com.accidentrisksystem.backend.entity.Admin;
import com.accidentrisksystem.backend.exception.BadRequestException;
import com.accidentrisksystem.backend.exception.ResourceNotFoundException;
import com.accidentrisksystem.backend.irepository.IAdminRepository;
import com.accidentrisksystem.backend.iservice.IAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminService implements IAdminService {

    private final IAdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AdminResponseDto createAdmin(AdminRequestDto request) {
        if (adminRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Username already exists");
        }

        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email already exists");
        }

        Admin admin = new Admin();
        admin.setFullName(request.getFullName());
        admin.setEmail(request.getEmail());
        admin.setUsername(request.getUsername());
        admin.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        admin.setIsActive(true);

        Admin savedAdmin = adminRepository.save(admin);
        return mapToResponse(savedAdmin);
    }

    @Override
    public AdminResponseDto getAdminProfile() {
        Admin admin = adminRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        return mapToResponse(admin);
    }

    @Override
    public void changePassword(ChangePasswordRequestDto request) {
        Admin admin = adminRepository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), admin.getPasswordHash())) {
            throw new BadRequestException("Old password is incorrect");
        }

        admin.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        adminRepository.save(admin);
    }

    private AdminResponseDto mapToResponse(Admin admin) {
        AdminResponseDto response = new AdminResponseDto();
        response.setAdminId(admin.getAdminId());
        response.setFullName(admin.getFullName());
        response.setEmail(admin.getEmail());
        response.setUsername(admin.getUsername());
        response.setIsActive(admin.getIsActive());
        return response;
    }
}