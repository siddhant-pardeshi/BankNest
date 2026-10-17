package com.banknest.dto;

import jakarta.validation.constraints.DecimalMin;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class WithdrawRequest {
    @DecimalMin(value = "1.0", message = "Minimum withdrawal amount is ₹1")
    private BigDecimal amount;

    private String description;
}
