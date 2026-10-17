package com.banknest.controller;

import com.banknest.dto.DepositRequest;
import com.banknest.dto.TransferRequest;
import com.banknest.dto.WithdrawRequest;
import com.banknest.security.UserPrincipal;
import com.banknest.service.AccountService;
import com.banknest.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final TransactionService transactionService;

    @GetMapping("/details")
    public ResponseEntity<Map<String, Object>> getDetails(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(accountService.getAccountDetails(principal.getEmail()));
    }

    @GetMapping("/balance")
    public ResponseEntity<Map<String, Object>> getBalance(@AuthenticationPrincipal UserPrincipal principal) {
        var account = accountService.getAccountByEmail(principal.getEmail());
        return ResponseEntity.ok(Map.of(
                "accountNumber", account.getAccountNumber(),
                "balance", account.getBalance()));
    }

    @PostMapping("/deposit")
    public ResponseEntity<Map<String, String>> deposit(@AuthenticationPrincipal UserPrincipal principal,
                                                       @Valid @RequestBody DepositRequest request) {
        return ResponseEntity.ok(Map.of("message", transactionService.deposit(principal.getEmail(), request)));
    }

    @PostMapping("/withdraw")
    public ResponseEntity<Map<String, String>> withdraw(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody WithdrawRequest request) {
        return ResponseEntity.ok(Map.of("message", transactionService.withdraw(principal.getEmail(), request)));
    }

    @PostMapping("/transfer")
    public ResponseEntity<Map<String, String>> transfer(@AuthenticationPrincipal UserPrincipal principal,
                                                        @Valid @RequestBody TransferRequest request) {
        return ResponseEntity.ok(Map.of("message", transactionService.transfer(principal.getEmail(), request)));
    }
}
