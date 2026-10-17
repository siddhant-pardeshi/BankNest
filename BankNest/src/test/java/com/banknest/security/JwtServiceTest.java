package com.banknest.security;

import com.banknest.entity.User;
import com.banknest.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtServiceTest {

    private JwtService jwtService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "test-secret-key-that-is-long-enough-for-hmac-sha256-algorithm",
                3_600_000L);
    }

    @Test
    void generateAndValidate_ShouldRoundTripEmail() {
        String token = jwtService.generateToken("user@example.com");
        assertEquals("user@example.com", jwtService.validateToken(token));
    }

    @Test
    void validate_ShouldRejectTamperedToken() {
        String token = jwtService.generateToken("user@example.com");
        String tampered = token.substring(0, token.length() - 2) + "xx";
        assertNull(jwtService.validateToken(tampered));
    }

    @Test
    void validate_ShouldRejectGarbageToken() {
        assertNull(jwtService.validateToken("not-a-jwt"));
    }

    @Test
    void userPrincipal_ShouldExposeEmailAndActiveFlag() {
        User user = User.builder().email("user@example.com").fullName("Test User").active(true).build();
        UserPrincipal principal = new UserPrincipal(user);
        assertEquals("user@example.com", principal.getUsername());
        assertTrue(principal.isEnabled());
    }

    @Test
    void userDetailsService_ShouldLoadUserByEmail() {
        User user = User.builder().email("user@example.com").active(true).build();
        CustomUserDetailsService service = new CustomUserDetailsService(userRepository);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        var details = service.loadUserByUsername("user@example.com");
        assertEquals("user@example.com", details.getUsername());
    }

    @Test
    void userDetailsService_ShouldThrowForUnknownEmail() {
        CustomUserDetailsService service = new CustomUserDetailsService(userRepository);
        when(userRepository.findByEmail("ghost@example.com")).thenReturn(Optional.empty());
        assertThrows(UsernameNotFoundException.class,
                () -> service.loadUserByUsername("ghost@example.com"));
    }
}
