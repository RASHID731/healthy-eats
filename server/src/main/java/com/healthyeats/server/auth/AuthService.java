package com.healthyeats.server.auth;

import com.healthyeats.server.user.User;
import com.healthyeats.server.user.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service layer handling authentication-related logic.
 *
 * Currently supports user registration by creating new users
 * with hashed (BCrypt) passwords stored in the database.
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    /**
     * Constructor-based injection for repository and password encoder.
     *
     * @param userRepository repository for persisting users
     * @param bCryptPasswordEncoder encoder for hashing passwords
     */
    public AuthService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    /**
     * Registers a new user.
     *
     * Steps:
     * 1. Hash the raw password with BCrypt (secure, salted hashing).
     * 2. Create a new User entity and set email + hashed password.
     * 3. Save the user in the database.
     *
     * @param email       new user's email
     * @param rawPassword plain-text password provided during signup
     * @return the saved User entity
     */
    public User register(String email, String rawPassword) {
        // Hash the password before saving (never store plain text passwords!)
        String hashedPassword = bCryptPasswordEncoder.encode(rawPassword);

        // Create new user and populate fields
        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(hashedPassword);

        // Persist user to DB and return
        return userRepository.save(user);
    }
}
