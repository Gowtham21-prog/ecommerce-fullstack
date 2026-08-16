package com.fieldingvane.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Checkout payload. Orders are always built from whatever is currently in the
 * user's server-side cart — the client does not send line items directly, to
 * avoid trusting client-supplied prices/stock.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotBlank(message = "shippingName is required")
    private String shippingName;

    @NotBlank(message = "shippingPhone is required")
    private String shippingPhone;

    @NotBlank(message = "shippingAddress is required")
    private String shippingAddress;

    @NotBlank(message = "shippingCity is required")
    private String shippingCity;

    @NotBlank(message = "shippingState is required")
    private String shippingState;

    @NotBlank(message = "shippingPincode is required")
    private String shippingPincode;

    /** "COD" (cash on delivery) is the only method actually processed today. */
    private String paymentMethod = "COD";
}
