package com.chuch.Orderly.domain.user.dto;

import java.util.Set;

import com.chuch.Orderly.domain.user.enums.RoleType;

import jakarta.validation.constraints.NotEmpty;

public record UpdateUserRolesRequest(
    @NotEmpty Set<RoleType> roles
) {
    
}
