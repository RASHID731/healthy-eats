package com.healthyeats.server.auth;

import com.healthyeats.server.user.User;
import com.healthyeats.server.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Custom implementation of Spring Security's {@link UserDetailsService}.
 *
 * Responsible for loading user-specific data during authentication.
 * This connects the application's User entity to Spring Security's
 * internal authentication system.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Constructor-based dependency injection.
     *
     * @param userRepository repository for fetching User entities
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Loads a user by their email (used as the username).
     *
     * Spring Security calls this method during authentication.
     *
     * Steps:
     * 1. Fetch user from the database by email.
     * 2. If not found, throw {@link UsernameNotFoundException}.
     * 3. Wrap the user data into a Spring Security {@link UserDetails} object.
     *
     * @param email the email of the user trying to authenticate
     * @return UserDetails object containing credentials and roles
     * @throws UsernameNotFoundException if the user does not exist
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Fetch user from database, or throw exception if not found
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Build Spring Security's UserDetails object from our User entity
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())       // principal (username)
                .password(user.getPasswordHash())    // hashed password
                .roles("USER")                       // assign default role
                .build();
    }
}
