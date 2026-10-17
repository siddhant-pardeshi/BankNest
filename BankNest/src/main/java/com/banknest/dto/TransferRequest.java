package com.banknest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    @NotBlank(message = "Recipient account number is required")
    private String toAccountNumber;

    @DecimalMin(value = "1.0", message = "Minimum transfer amount is ₹1")
    private BigDecimal amount;

    private String description;
}
