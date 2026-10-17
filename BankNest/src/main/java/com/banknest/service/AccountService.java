package com.banknest.service;

import com.banknest.entity.Account;
import com.banknest.entity.User;
import com.banknest.exception.ApiException;
import com.banknest.repository.AccountRepository;
import com.banknest.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public Account getAccountByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", HttpStatus.NOT_FOUND));
        return accountRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));
    }

    public Map<String, Object> getAccountDetails(String email) {
        Account account = getAccountByEmail(email);
        Map<String, Object> details = new LinkedHashMap<>();
        details.put("accountNumber", account.getAccountNumber());
        details.put("accountType", account.getAccountType());
        details.put("balance", account.getBalance());
        details.put("ownerName", account.getUser().getFullName());
        details.put("email", account.getUser().getEmail());
        details.put("active", account.isActive());
        details.put("createdAt", account.getCreatedAt());
        return details;
    }
}
