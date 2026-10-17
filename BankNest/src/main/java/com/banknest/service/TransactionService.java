package com.banknest.service;

import com.banknest.dto.DepositRequest;
import com.banknest.dto.TransferRequest;
import com.banknest.dto.WithdrawRequest;
import com.banknest.entity.Account;
import com.banknest.entity.Transaction;
import com.banknest.entity.TransactionStatus;
import com.banknest.entity.TransactionType;
import com.banknest.exception.ApiException;
import com.banknest.repository.AccountRepository;
import com.banknest.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final AccountService accountService;

    @Transactional
    public String deposit(String email, DepositRequest request) {
        validateAmount(request.getAmount(), "Deposit");
        Account account = accountService.getAccountByEmail(email);

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        transactionRepository.save(Transaction.builder()
                .toAccountNumber(account.getAccountNumber())
                .amount(request.getAmount())
                .type(TransactionType.DEPOSIT)
                .status(TransactionStatus.COMPLETED)
                .description(defaultDescription(request.getDescription(), "Cash Deposit"))
                .build());

        return "Deposit of " + request.getAmount() + " completed successfully";
    }

    @Transactional
    public String withdraw(String email, WithdrawRequest request) {
        validateAmount(request.getAmount(), "Withdrawal");
        Account account = accountService.getAccountByEmail(email);

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ApiException("Insufficient balance", HttpStatus.BAD_REQUEST);
        }

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        transactionRepository.save(Transaction.builder()
                .fromAccountNumber(account.getAccountNumber())
                .amount(request.getAmount())
                .type(TransactionType.WITHDRAWAL)
                .status(TransactionStatus.COMPLETED)
                .description(defaultDescription(request.getDescription(), "Cash Withdrawal"))
                .build());

        return "Withdrawal of " + request.getAmount() + " completed successfully";
    }

    /**
     * Both rows are fetched with a pessimistic write lock, so two concurrent
     * transfers touching the same account are serialised by the database and
     * the balance can never go negative through a race.
     */
    @Transactional
    public String transfer(String email, TransferRequest request) {
        validateAmount(request.getAmount(), "Transfer");

        Account sender = accountRepository.findByUserEmailForUpdate(email)
                .orElseThrow(() -> new ApiException("Account not found", HttpStatus.NOT_FOUND));
        Account receiver = accountRepository.findByAccountNumberForUpdate(request.getToAccountNumber())
                .orElseThrow(() -> new ApiException("Recipient account not found", HttpStatus.NOT_FOUND));

        if (sender.getAccountNumber().equals(receiver.getAccountNumber())) {
            throw new ApiException("Cannot transfer to your own account", HttpStatus.BAD_REQUEST);
        }
        if (!receiver.isActive()) {
            throw new ApiException("Recipient account is inactive", HttpStatus.BAD_REQUEST);
        }
        if (sender.getBalance().compareTo(request.getAmount()) < 0) {
            throw new ApiException("Insufficient balance", HttpStatus.BAD_REQUEST);
        }

        sender.setBalance(sender.getBalance().subtract(request.getAmount()));
        receiver.setBalance(receiver.getBalance().add(request.getAmount()));
        accountRepository.save(sender);
        accountRepository.save(receiver);

        transactionRepository.save(Transaction.builder()
                .fromAccountNumber(sender.getAccountNumber())
                .toAccountNumber(receiver.getAccountNumber())
                .amount(request.getAmount())
                .type(TransactionType.TRANSFER)
                .status(TransactionStatus.COMPLETED)
                .description(defaultDescription(request.getDescription(), "Fund Transfer"))
                .build());

        return "Transfer of " + request.getAmount() + " completed successfully";
    }

    @Transactional(readOnly = true)
    public List<Transaction> getHistory(String email) {
        String accountNumber = accountService.getAccountByEmail(email).getAccountNumber();
        return transactionRepository.findByFromAccountNumberOrToAccountNumberOrderByTimestampDesc(
                accountNumber, accountNumber);
    }

    private void validateAmount(BigDecimal amount, String operation) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ApiException(operation + " amount must be greater than zero");
        }
    }

    private String defaultDescription(String description, String fallback) {
        return (description != null && !description.isBlank()) ? description.trim() : fallback;
    }
}
