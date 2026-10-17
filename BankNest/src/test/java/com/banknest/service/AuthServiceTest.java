package com.banknest.service;

import com.banknest.dto.RegisterRequest;
import com.banknest.entity.Account;
import com.banknest.entity.AccountType;
import com.banknest.entity.Role;
import com.banknest.entity.User;
import com.banknest.exception.ApiException;
import com.banknest.repository.AccountRepository;
import com.banknest.repository.UserRepository;
import com.banknest.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private AccountRepository accountRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest request;

    @BeforeEach
    void setUp() {
        request = new RegisterRequest();
        request.setFullName("  Aarav Sharma ");
        request.setEmail("  Aarav@Example.COM ");
        request.setPassword("secret123");
        request.setAccountType(AccountType.SAVINGS);
    }

    @Test
    void register_ShouldHashPassword_NormaliseEmail_AndCreateAccount() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("$2a$encoded");
        when(accountRepository.findByAccountNumber(anyString())).thenReturn(Optional.empty());

        authService.register(request);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User saved = userCaptor.getValue();
        assertEquals("aarav@example.com", saved.getEmail());
        assertEquals("Aarav Sharma", saved.getFullName());
        assertEquals("$2a$encoded", saved.getPassword());
        assertEquals(Role.CUSTOMER, saved.getRole());

        ArgumentCaptor<Account> accountCaptor = ArgumentCaptor.forClass(Account.class);
        verify(accountRepository).save(accountCaptor.capture());
        Account account = accountCaptor.getValue();
        assertEquals(new BigDecimal("1000.00"), account.getBalance());
        assertEquals(AccountType.SAVINGS, account.getAccountType());
        assertTrue(account.getAccountNumber().matches("\\d{10}"));
    }

    @Test
    void register_ShouldRejectDuplicateEmail() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class, () -> authService.register(request));
        assertEquals("Email already registered", ex.getMessage());
        verify(userRepository, never()).save(any());
    }

    @Test
    void login_ShouldSucceed_WithCorrectPassword() {
        User user = User.builder()
                .email("aarav@example.com")
                .password("$2a$encoded")
                .active(true)
                .build();
        when(userRepository.findByEmail("aarav@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "$2a$encoded")).thenReturn(true);
        when(jwtService.generateToken("aarav@example.com")).thenReturn("jwt-token");
        when(accountRepository.findByUserId(any())).thenReturn(
                Optional.of(Account.builder().accountNumber("1234567890").build()));

        var response = authService.login(loginRequest("aarav@example.com", "secret123"));

        assertEquals("aarav@example.com", response.getEmail());
        assertEquals("1234567890", response.getAccountNumber());
        assertNotNull(response.getToken());
    }

    @Test
    void login_ShouldRejectWrongPassword() {
        User user = User.builder().email("aarav@example.com").password("$2a$encoded").active(true).build();
        when(userRepository.findByEmail("aarav@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "$2a$encoded")).thenReturn(false);

        assertThrows(ApiException.class,
                () -> authService.login(loginRequest("aarav@example.com", "wrong")));
    }

    @Test
    void login_ShouldRejectDeactivatedUser() {
        User user = User.builder().email("aarav@example.com").password("$2a$encoded").active(false).build();
        when(userRepository.findByEmail("aarav@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        ApiException ex = assertThrows(ApiException.class,
                () -> authService.login(loginRequest("aarav@example.com", "secret123")));
        assertEquals("This account has been deactivated", ex.getMessage());
    }

    private com.banknest.dto.LoginRequest loginRequest(String email, String password) {
        com.banknest.dto.LoginRequest loginRequest = new com.banknest.dto.LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);
        return loginRequest;
    }
}
