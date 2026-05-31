package com.accidentrisksystem.backend.repository;

import com.accidentrisksystem.backend.entity.Admin;
import com.accidentrisksystem.backend.irepository.IAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class AdminRepository {

    private final IAdminRepository adminRepository;

    public Admin save(Admin admin) {
        return adminRepository.save(admin);
    }

    public Optional<Admin> findById(Long id) {
        return adminRepository.findById(id);
    }

    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Optional<Admin> findByEmail(String email) {
        return adminRepository.findByEmail(email);
    }

    public Optional<Admin> findFirstAdmin() {
        return adminRepository.findAll().stream().findFirst();
    }
}