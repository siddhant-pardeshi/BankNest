package com.banknest.controller;

import com.banknest.entity.Transaction;
import com.banknest.security.UserPrincipal;
import com.banknest.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping("/history")
    public ResponseEntity<List<Transaction>> getHistory(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(transactionService.getHistory(principal.getEmail()));
    }
}
