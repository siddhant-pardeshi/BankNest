package com.banknest.service;

import com.banknest.dto.TransferRequest;
import com.banknest.entity.Account;
import com.banknest.entity.AccountType;
import com.banknest.entity.User;
import com.banknest.exception.ApiException;
import com.banknest.repository.AccountRepository;
import com.banknest.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TransactionServiceTest {

    @Mock private AccountRepository accountRepository;
    @Mock private TransactionRepository transactionRepository;
    @Mock private AccountService accountService;

    @InjectMocks private TransactionService transactionService;

    private Account sender;
    private Account receiver;

    private static final String SENDER_EMAIL = "sender@example.com";

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        User senderUser = User.builder()
                .email(SENDER_EMAIL)
                .fullName("Sender User")
                .build();

        sender = Account.builder()
                .accountNumber("1111111111")
                .balance(new BigDecimal("5000"))
                .accountType(AccountType.SAVINGS)
                .user(senderUser)
                .build();

        receiver = Account.builder()
                .accountNumber("2222222222")
                .balance(new BigDecimal("1000"))
                .accountType(AccountType.SAVINGS)
                .build();
    }

    @Test
    void transfer_ShouldSucceed_WhenSufficientBalance() {
        TransferRequest request = transferRequest("2222222222", "1000", "Test transfer");

        when(accountRepository.findByUserEmailForUpdate(SENDER_EMAIL)).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumberForUpdate("2222222222")).thenReturn(Optional.of(receiver));

        String result = transactionService.transfer(SENDER_EMAIL, request);

        assertTrue(result.startsWith("Transfer of 1000"));
        assertEquals(new BigDecimal("4000"), sender.getBalance());
        assertEquals(new BigDecimal("2000"), receiver.getBalance());
        verify(transactionRepository).save(any());
    }

    @Test
    void transfer_ShouldFail_WhenInsufficientBalance() {
        TransferRequest request = transferRequest("2222222222", "9999", null);

        when(accountRepository.findByUserEmailForUpdate(SENDER_EMAIL)).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumberForUpdate("2222222222")).thenReturn(Optional.of(receiver));

        ApiException ex = assertThrows(ApiException.class,
                () -> transactionService.transfer(SENDER_EMAIL, request));

        assertEquals("Insufficient balance", ex.getMessage());
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void transfer_ShouldFail_WhenTransferringToSelf() {
        receiver.setAccountNumber("1111111111");
        TransferRequest request = transferRequest("1111111111", "100", null);

        when(accountRepository.findByUserEmailForUpdate(SENDER_EMAIL)).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumberForUpdate("1111111111")).thenReturn(Optional.of(receiver));

        ApiException ex = assertThrows(ApiException.class,
                () -> transactionService.transfer(SENDER_EMAIL, request));

        assertEquals("Cannot transfer to your own account", ex.getMessage());
    }

    @Test
    void transfer_ShouldFail_WhenRecipientNotFound() {
        TransferRequest request = transferRequest("9999999999", "100", null);

        when(accountRepository.findByUserEmailForUpdate(SENDER_EMAIL)).thenReturn(Optional.of(sender));
        when(accountRepository.findByAccountNumberForUpdate("9999999999")).thenReturn(Optional.empty());

        assertThrows(ApiException.class, () -> transactionService.transfer(SENDER_EMAIL, request));
    }

    @Test
    void transfer_ShouldFail_WhenAmountIsZeroOrNegative() {
        TransferRequest request = transferRequest("2222222222", "0", null);

        ApiException ex = assertThrows(ApiException.class,
                () -> transactionService.transfer(SENDER_EMAIL, request));

        assertEquals("Transfer amount must be greater than zero", ex.getMessage());
        verify(accountRepository, never()).findByUserEmailForUpdate(any());
    }

    private TransferRequest transferRequest(String toAccountNumber, String amount, String description) {
        TransferRequest request = new TransferRequest();
        request.setToAccountNumber(toAccountNumber);
        request.setAmount(new BigDecimal(amount));
        request.setDescription(description);
        return request;
    }
}
