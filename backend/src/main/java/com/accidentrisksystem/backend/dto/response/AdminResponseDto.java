package com.accidentrisksystem.backend.dto.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminResponseDto {

    private Long adminId;
    private String fullName;
    private String email;
    private String username;
    private Boolean isActive;
}