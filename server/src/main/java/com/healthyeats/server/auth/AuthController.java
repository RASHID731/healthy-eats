package com.healthyeats.server.auth;

import com.healthyeats.server.user.User;
import com.healthyeats.server.user.UserDTO;
import com.healthyeats.server.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller providing endpoints for
 * user registration, login, checking the current session user,
 * and logging out.
 *
 * All routes are prefixed with "/api/auth".
 * Cross-origin requests from the frontend (localhost:5173) are allowed.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;

    /**
     * Constructor-based dependency injection for required services.
     */
    public AuthController(AuthService authService, UserRepository userRepository, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
    }

    /**
     * Registers a new user with the given email and password.
     *
     * @param email    email of the new user
     * @param password raw password of the new user
     * @return DTO containing basic user information
     */
    @PostMapping("/register")
    public UserDTO register(@RequestParam String email, @RequestParam String password) {
        User user = authService.register(email, password);
        return new UserDTO(user.getId(), user.getEmail(), user.getCreatedAt());
    }

    /**
     * Logs a user in using Spring Security authentication.
     * On success, the SecurityContext is stored in the HTTP session,
     * so that the authentication persists across page reloads.
     *
     * @param email    user email
     * @param password user password
     * @param request  HTTP request (used to store session)
     * @return DTO containing user details
     */
    @PostMapping("/login")
    public UserDTO login(@RequestParam String email, @RequestParam String password, HttpServletRequest request) {
        // Authenticate using Spring Security's AuthenticationManager
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Persist SecurityContext into HTTP session so it survives refresh
        request.getSession(true).setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                SecurityContextHolder.getContext()
        );

        // Fetch the authenticated user from the repository
        User user = userRepository.findByEmail(email).orElseThrow();
        return new UserDTO(user.getId(), user.getEmail(), user.getCreatedAt());
    }

    /**
     * Returns the currently authenticated user, if any.
     *
     * @return UserDTO of the logged-in user, or null if not authenticated
     */
    @GetMapping("/me")
    public UserDTO me() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // If no authentication is set or user is anonymous, return null
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return null;
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return new UserDTO(user.getId(), user.getEmail(), user.getCreatedAt());
    }

    /**
     * Logs the user out by invalidating the HTTP session
     * and clearing the Spring Security context.
     *
     * @param request  HTTP request containing the session
     * @param response HTTP response (used to set logout status)
     */
    @PostMapping("/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        var session = request.getSession(false);
        if (session != null) {
            session.invalidate(); // Kill the HTTP session
        }
        SecurityContextHolder.clearContext(); // Remove authentication info
        response.setStatus(HttpServletResponse.SC_OK);
    }
}

