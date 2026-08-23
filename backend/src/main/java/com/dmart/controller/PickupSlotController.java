package com.dmart.controller;

import com.dmart.dto.request.SlotCreateRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.entity.PickupSlot;
import com.dmart.service.PickupSlotService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/slots")
@Tag(name = "Store Pickup Slots", description = "Scheduled store pickup time slots and capacity checks")
public class PickupSlotController {

    @Autowired
    private PickupSlotService pickupSlotService;

    @GetMapping
    @Operation(summary = "Get all available pickup slots for store pickup")
    public ResponseEntity<ApiResponse<List<PickupSlot>>> getAvailableSlots() {
        List<PickupSlot> slots = pickupSlotService.getAvailableSlots();
        return ResponseEntity.ok(ApiResponse.success("Available pickup slots retrieved", slots));
    }

    @GetMapping("/by-date")
    @Operation(summary = "Get pickup slots for a specific date")
    public ResponseEntity<ApiResponse<List<PickupSlot>>> getSlotsByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<PickupSlot> slots = pickupSlotService.getSlotsByDate(date);
        return ResponseEntity.ok(ApiResponse.success("Pickup slots for date retrieved", slots));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new store pickup slot (Admin only)")
    public ResponseEntity<ApiResponse<PickupSlot>> createSlot(@Valid @RequestBody SlotCreateRequest request) {
        PickupSlot slot = pickupSlotService.createSlot(request);
        return ResponseEntity.ok(ApiResponse.success("Pickup slot created successfully", slot));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Enable or disable a pickup slot (Admin only)")
    public ResponseEntity<ApiResponse<Void>> toggleSlot(@PathVariable Long id, @RequestParam boolean active) {
        pickupSlotService.toggleSlotStatus(id, active);
        return ResponseEntity.ok(ApiResponse.success("Pickup slot status updated"));
    }
}
