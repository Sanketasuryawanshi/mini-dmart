package com.dmart.controller;

import com.dmart.dto.request.ReturnCreateRequest;
import com.dmart.dto.request.ReturnProcessRequest;
import com.dmart.dto.response.ApiResponse;
import com.dmart.entity.ReturnRequest;
import com.dmart.service.ReturnService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/returns")
@Tag(name = "Returns & Exchanges", description = "Return and exchange eligibility, requests, and staff review")
public class ReturnController {

    @Autowired
    private ReturnService returnService;

    @PostMapping
    @Operation(summary = "Submit a return or exchange request for a delivered order")
    public ResponseEntity<ApiResponse<ReturnRequest>> createReturnRequest(@Valid @RequestBody ReturnCreateRequest request) {
        ReturnRequest returnRequest = returnService.createReturnRequest(request);
        return ResponseEntity.ok(ApiResponse.success("Return/Exchange request submitted successfully", returnRequest));
    }

    @GetMapping("/my-returns")
    @Operation(summary = "Get current authenticated customer's return requests")
    public ResponseEntity<ApiResponse<List<ReturnRequest>>> getMyReturnRequests() {
        List<ReturnRequest> returnRequests = returnService.getCurrentUserReturnRequests();
        return ResponseEntity.ok(ApiResponse.success("Return requests retrieved", returnRequests));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get return request details by ID")
    public ResponseEntity<ApiResponse<ReturnRequest>> getReturnRequestById(@PathVariable Long id) {
        ReturnRequest returnRequest = returnService.getReturnRequestById(id);
        return ResponseEntity.ok(ApiResponse.success("Return request details retrieved", returnRequest));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Operation(summary = "Get all return & exchange requests for review (Staff/Admin)")
    public ResponseEntity<ApiResponse<List<ReturnRequest>>> getAllReturnRequests() {
        List<ReturnRequest> returnRequests = returnService.getAllReturnRequests();
        return ResponseEntity.ok(ApiResponse.success("All return requests retrieved", returnRequests));
    }

    @PatchMapping("/{id}/process")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @Operation(summary = "Approve or Reject a return request with inventory restock option (Staff/Admin)")
    public ResponseEntity<ApiResponse<ReturnRequest>> processReturnRequest(
            @PathVariable Long id,
            @Valid @RequestBody ReturnProcessRequest request) {
        ReturnRequest processed = returnService.processReturnRequest(id, request);
        return ResponseEntity.ok(ApiResponse.success("Return request status updated to " + processed.getStatus(), processed));
    }
}
