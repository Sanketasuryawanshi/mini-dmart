package com.dmart.dto.request;

import com.dmart.entity.ReturnReason;
import com.dmart.entity.ReturnRequestType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class ReturnCreateRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Request type is required (RETURN or EXCHANGE)")
    private ReturnRequestType requestType;

    @NotNull(message = "Return reason is required")
    private ReturnReason reason;

    private String customerComments;

    @NotEmpty(message = "At least one item must be selected for return/exchange")
    @Valid
    private List<ReturnItemRequest> items;

    public ReturnCreateRequest() {
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public ReturnRequestType getRequestType() {
        return requestType;
    }

    public void setRequestType(ReturnRequestType requestType) {
        this.requestType = requestType;
    }

    public ReturnReason getReason() {
        return reason;
    }

    public void setReason(ReturnReason reason) {
        this.reason = reason;
    }

    public String getCustomerComments() {
        return customerComments;
    }

    public void setCustomerComments(String customerComments) {
        this.customerComments = customerComments;
    }

    public List<ReturnItemRequest> getItems() {
        return items;
    }

    public void setItems(List<ReturnItemRequest> items) {
        this.items = items;
    }
}
