package com.banknest.service;

import com.banknest.dto.AuthResponse;
import com.banknest.dto.LoginRequest;
import com.banknest.dto.RegisterRequest;
import com.banknest.entity.Account;
import com.banknest.entity.AccountType;
import com.banknest.entity.Role;
import com.banknest.entity.User;
import com.banknest.exception.ApiException;
import com.banknest.repository.AccountRepository;
import com.banknest.repository.UserRepository;
import com.banknest.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String WELCOME_BONUS = "1000.00";
    private static final int MAX_ACCOUNT_NUMBER_ATTEMPTS = 10;

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final SecureRandom random = new SecureRandom();

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = normalize(request.getEmail());
        if (userRepository.existsByEmail(email)) {
            throw new ApiException("Email already registered", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .fullName(request.getFullName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.CUSTOMER)
                .active(true)
                .build();
        userRepository.save(user);

        Account account = Account.builder()
                .accountNumber(generateUniqueAccountNumber())
                .accountType(request.getAccountType() != null
                        ? request.getAccountType() : AccountType.SAVINGS)
                .balance(new BigDecimal(WELCOME_BONUS))
                .user(user)
                .active(true)
                .build();
        accountRepository.save(account);

        return buildAuthResponse(user, account.getAccountNumber(),
                "Account created successfully. Your welcome bonus has been credited.");
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = normalize(request.getEmail());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ApiException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        if (!user.isActive()) {
            throw new ApiException("This account has been deactivated", HttpStatus.FORBIDDEN);
        }

        Account account = accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Account not found for user", HttpStatus.NOT_FOUND));

        return buildAuthResponse(user, account.getAccountNumber(), "Login successful");
    }

    private AuthResponse buildAuthResponse(User user, String accountNumber, String message) {
        return new AuthResponse(jwtService.generateToken(user.getEmail()), user.getEmail(),
                accountNumber, message);
    }

    private String normalize(String email) {
        return email == null ? null : email.trim().toLowerCase();
    }

    private String generateUniqueAccountNumber() {
        for (int attempt = 0; attempt < MAX_ACCOUNT_NUMBER_ATTEMPTS; attempt++) {
            long number = 1_000_000_000L + (long) (random.nextDouble() * 9_000_000_000L);
            String candidate = String.valueOf(number);
            if (accountRepository.findByAccountNumber(candidate).isEmpty()) {
                return candidate;
            }
        }
        throw new ApiException("Could not allocate an account number, please retry",
                HttpStatus.SERVICE_UNAVAILABLE);
    }
}
