package com.dmart.controller;

import com.dmart.dto.response.ApiResponse;
import com.dmart.dto.response.DashboardStatsResponse;
import com.dmart.entity.Role;
import com.dmart.entity.User;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.UserRepository;
import com.dmart.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Analytics & Management", description = "Admin dashboard KPIs, revenue analytics, and user role management")
public class AdminAnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    @Operation(summary = "Get executive dashboard statistics, sales chart, and inventory metrics")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        DashboardStatsResponse stats = analyticsService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/users")
    @Operation(summary = "Get all registered users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PatchMapping("/users/{id}/role")
    @Operation(summary = "Update user role (RBAC)")
    public ResponseEntity<ApiResponse<User>> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        String roleStr = body.get("role");
        if (roleStr != null) {
            user.setRole(Role.valueOf(roleStr));
            userRepository.save(user);
        }

        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", user));
    }
}
