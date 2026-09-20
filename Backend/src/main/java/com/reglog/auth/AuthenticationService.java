package com.reglog.auth;

import com.reglog.dto.LoginRequest;
import com.reglog.dto.UserResponse;
import com.reglog.entity.JWTToken;
import com.reglog.entity.User;
import com.reglog.security.JwtUtil;
import com.reglog.user.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.Optional;

@Service
public class AuthenticationService {

    public static final String COOKIE_NAME = "jwt_token";

    private final AuthenticationRepository authenticationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthenticationService(AuthenticationRepository authenticationRepository,
                                 UserRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtUtil jwtUtil) {
        this.authenticationRepository = authenticationRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Transactional
    public UserResponse login(LoginRequest request, HttpServletResponse response) {
        String username = request.getName() != null ? request.getName().trim() : "";
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new BadCredentialsException("Invalid username or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password.");
        }

        // Generate JWT Token
        String token = jwtUtil.generateToken(user.getName(), user.getUid());

        Date issuedAt = jwtUtil.getIssuedAtDateFromToken(token);
        Date expiresAt = jwtUtil.getExpirationDateFromToken(token);

        LocalDateTime createdTime = LocalDateTime.ofInstant(issuedAt.toInstant(), ZoneId.systemDefault());
        LocalDateTime expireTime = LocalDateTime.ofInstant(expiresAt.toInstant(), ZoneId.systemDefault());

        // Save Token details into JWTToken table
        JWTToken jwtTokenEntity = new JWTToken(user.getUid(), token, createdTime, expireTime);
        authenticationRepository.save(jwtTokenEntity);

        // Create HTTP-Only Cookie
        ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, token)
                .httpOnly(true)
                .secure(false) // localhost dev
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        return new UserResponse(user.getUid(), user.getName(), user.getEmail(), user.getPhone());
    }

    public UserResponse getAuthenticatedUser(HttpServletRequest request) {
        String token = extractTokenFromRequest(request);

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("No authentication token provided.");
        }

        if (!jwtUtil.validateToken(token)) {
            throw new IllegalArgumentException("Invalid or expired authentication token.");
        }

        // Verify token exists in JWTToken table
        Optional<JWTToken> tokenEntityOpt = authenticationRepository.findByToken(token);
        if (tokenEntityOpt.isEmpty()) {
            throw new IllegalArgumentException("Token has been invalidated.");
        }

        String username = jwtUtil.getUsernameFromToken(token);
        User user = userRepository.findByName(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found for token."));

        return new UserResponse(user.getUid(), user.getName(), user.getEmail(), user.getPhone());
    }

    @Transactional
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        String token = extractTokenFromRequest(request);

        if (token != null && !token.isBlank()) {
            authenticationRepository.deleteByToken(token);
        }

        // Clear HTTP-Only Cookie
        ResponseCookie clearCookie = ResponseCookie.from(COOKIE_NAME, "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0)
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, clearCookie.toString());
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        // 1. Try reading from HTTP-Only cookie
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (COOKIE_NAME.equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        // 2. Fallback to Authorization Header if present
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return null;
    }
}
