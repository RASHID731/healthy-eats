package com.healthyeats.server.user;

import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

/**
 * Entity representing an application user.
 *
 * Stores login credentials (email + hashed password) and
 * metadata such as creation timestamp.
 *
 * Mapped to the "users" table.
 */
@Entity
@Data
@Table(name = "users")
public class User {

    /**
     * Primary key.
     * Auto-generated using the database's identity strategy.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Unique email address of the user.
     * Serves as the login identifier.
     * Cannot be null.
     */
    @Column(unique = true, nullable = false)
    private String email;

    /**
     * Hashed password (BCrypt).
     * Raw passwords are never stored in the database.
     */
    @Column(nullable = false)
    private String passwordHash;

    /**
     * Timestamp when the user account was created.
     * Defaults to the current instant.
     */
    private Instant createdAt = Instant.now();
}
