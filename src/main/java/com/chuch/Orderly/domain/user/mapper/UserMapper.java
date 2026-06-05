package com.chuch.Orderly.domain.user.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.chuch.Orderly.domain.user.dto.RegisterRequest;
import com.chuch.Orderly.domain.user.dto.UserResponse;
import com.chuch.Orderly.domain.user.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "roles", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "lastLogin", ignore = true)
    User toEntity(RegisterRequest request);

    @Mapping(target = "roles", expression = "java(user.getRoles().stream().map(r -> r.getRoleType().name()).collect(java.util.stream.Collectors.toSet()))")
    UserResponse toResponse(User user);

}
