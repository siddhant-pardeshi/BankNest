package com.banknest.controller;

import com.banknest.entity.Beneficiary;
import com.banknest.security.UserPrincipal;
import com.banknest.service.BeneficiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<Beneficiary> add(@AuthenticationPrincipal UserPrincipal principal,
                                           @RequestBody Beneficiary beneficiary) {
        return ResponseEntity.ok(beneficiaryService.addBeneficiary(principal.getEmail(), beneficiary));
    }

    @GetMapping
    public ResponseEntity<List<Beneficiary>> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(beneficiaryService.getBeneficiaries(principal.getEmail()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@AuthenticationPrincipal UserPrincipal principal,
                                                      @PathVariable Long id) {
        beneficiaryService.deleteBeneficiary(principal.getEmail(), id);
        return ResponseEntity.ok(Map.of("message", "Beneficiary removed successfully"));
    }
}
