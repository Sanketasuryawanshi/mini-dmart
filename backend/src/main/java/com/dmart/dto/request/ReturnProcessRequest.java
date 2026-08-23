package com.dmart.dto.request;

import com.dmart.entity.ReturnStatus;
import jakarta.validation.constraints.NotNull;

public class ReturnProcessRequest {

    @NotNull(message = "Status is required (APPROVED or REJECTED)")
    private ReturnStatus status;

    private String staffNotes;

    private Boolean restockInventory = true;

    public ReturnProcessRequest() {
    }

    public ReturnStatus getStatus() {
        return status;
    }

    public void setStatus(ReturnStatus status) {
        this.status = status;
    }

    public String getStaffNotes() {
        return staffNotes;
    }

    public void setStaffNotes(String staffNotes) {
        this.staffNotes = staffNotes;
    }

    public Boolean getRestockInventory() {
        return restockInventory;
    }

    public void setRestockInventory(Boolean restockInventory) {
        this.restockInventory = restockInventory;
    }
}
