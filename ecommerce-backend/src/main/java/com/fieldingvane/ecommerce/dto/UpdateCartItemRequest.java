package com.fieldingvane.ecommerce.dto;

import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateCartItemRequest {

    @Min(value = 1, message = "quantity must be at least 1")
    private int quantity;
}
