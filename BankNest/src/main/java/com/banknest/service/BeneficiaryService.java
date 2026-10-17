package com.banknest.service;

import com.banknest.entity.Beneficiary;
import com.banknest.exception.ApiException;
import com.banknest.repository.AccountRepository;
import com.banknest.repository.BeneficiaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BeneficiaryService {

    private final BeneficiaryRepository beneficiaryRepository;
    private final AccountRepository accountRepository;

    @Transactional
    public Beneficiary addBeneficiary(String ownerEmail, Beneficiary beneficiary) {
        if (beneficiaryRepository.existsByOwnerEmailAndAccountNumber(
                ownerEmail, beneficiary.getAccountNumber())) {
            throw new ApiException("This beneficiary is already saved", HttpStatus.CONFLICT);
        }
        beneficiary.setOwnerEmail(ownerEmail);
        beneficiary.setName(beneficiary.getName().trim());
        return beneficiaryRepository.save(beneficiary);
    }

    @Transactional(readOnly = true)
    public List<Beneficiary> getBeneficiaries(String ownerEmail) {
        return beneficiaryRepository.findByOwnerEmailOrderByCreatedAtDesc(ownerEmail);
    }

    @Transactional
    public void deleteBeneficiary(String ownerEmail, Long id) {
        Beneficiary beneficiary = beneficiaryRepository.findById(id)
                .orElseThrow(() -> new ApiException("Beneficiary not found", HttpStatus.NOT_FOUND));
        if (!beneficiary.getOwnerEmail().equals(ownerEmail)) {
            throw new ApiException("You can only remove your own beneficiaries", HttpStatus.FORBIDDEN);
        }
        beneficiaryRepository.delete(beneficiary);
    }
}
