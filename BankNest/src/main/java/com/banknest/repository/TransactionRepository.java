package com.banknest.repository;

import com.banknest.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByFromAccountNumberOrToAccountNumberOrderByTimestampDesc(
            String fromAccountNumber, String toAccountNumber);
}
