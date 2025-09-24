package com.healthyeats.server.user;

import java.time.Instant;

/**
 * Data Transfer Object (DTO) representing a user
 * as exposed via the API.
 *
 * Excludes sensitive fields like the password hash,
 * exposing only safe information.
 *
 * @param id        unique identifier of the user
 * @param email     user’s email (login identifier)
 * @param createdAt timestamp when the user account was created
 */
public record UserDTO(
        Long id,
        String email,
        Instant createdAt
) {}