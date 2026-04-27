package com.accidentrisksystem.backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminRequestDto {

    private String fullName;
    private String email;
    private String username;
    private String password;
}