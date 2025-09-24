package com.healthyeats.server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Security configuration for the application.
 *
 * Defines:
 * - Password encoding strategy
 * - Authentication manager
 * - Authorization rules (which endpoints are public vs. secured)
 * - CORS configuration for frontend integration
 */
@Configuration
public class SecurityConfig {

    /**
     * Defines the password encoder bean.
     * Uses BCrypt, a strong hashing algorithm that automatically salts passwords.
     *
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the AuthenticationManager bean.
     * Required for manual authentication (e.g. in AuthController).
     *
     * @param config authentication configuration auto-provided by Spring
     * @return AuthenticationManager
     * @throws Exception if configuration fails
     */
    @Bean
    AuthenticationManager authenticationManagerBean(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Defines the Spring Security filter chain.
     *
     * Configures:
     * - CORS: enabled with defaults (overridden below in corsConfigurationSource)
     * - CSRF: disabled (not needed for token/session-based APIs)
     * - Authorization rules:
     *     - /api/auth/** → public (register, login, etc.)
     *     - /api/products/** → public (view products)
     *     - /api/categories/** → public (browse categories)
     *     - /api/cart/** → public (cart tied to session)
     *     - /api/checkout/webhook → public (Stripe webhook)
     *     - all other endpoints → require authentication
     * - Form login & HTTP basic → disabled (using custom auth/session handling instead)
     *
     * @param http HttpSecurity object
     * @return built SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())  // enable CORS
                .csrf(csrf -> csrf.disable())     // disable CSRF for stateless API
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/products/**").permitAll()
                        .requestMatchers("/api/categories/**").permitAll()
                        .requestMatchers("/api/cart/**").permitAll()
                        .requestMatchers("/api/checkout/webhook").permitAll()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form.disable())   // disable default login page
                .httpBasic(basic -> basic.disable()); // disable HTTP Basic auth

        return http.build();
    }

    /**
     * Defines the CORS configuration for cross-origin requests.
     *
     * Allows:
     * - Origin: http://localhost:5173 (frontend dev server)
     * - Methods: GET, POST, PUT, DELETE, OPTIONS
     * - Headers: all
     * - Credentials: true (cookies/session IDs are included)
     *
     * @return CorsConfigurationSource with allowed settings
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var cfg = new CorsConfiguration();
        cfg.setAllowedOrigins(List.of("http://localhost:5173"));
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("*"));
        cfg.setAllowCredentials(true);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
    }
}
