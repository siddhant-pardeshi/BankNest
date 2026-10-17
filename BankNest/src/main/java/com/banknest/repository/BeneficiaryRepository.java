package com.banknest.repository;

import com.banknest.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {
    List<Beneficiary> findByOwnerEmailOrderByCreatedAtDesc(String ownerEmail);
    boolean existsByOwnerEmailAndAccountNumber(String ownerEmail, String accountNumber);
}
