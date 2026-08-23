package com.dmart.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class DashboardStatsResponse {

    private BigDecimal totalRevenue;
    private BigDecimal revenueToday;
    private long totalOrders;
    private long ordersToday;
    private long totalCustomers;
    private long lowStockCount;
    private long pendingReturnsCount;
    private long ordersToPrepareCount;
    private long pickupOrdersToday;

    private List<Map<String, Object>> recentOrders;
    private List<Map<String, Object>> lowStockItems;
    private List<Map<String, Object>> topSellingCategories;
    private List<Map<String, Object>> dailySalesChart;

    public DashboardStatsResponse() {
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getRevenueToday() {
        return revenueToday;
    }

    public void setRevenueToday(BigDecimal revenueToday) {
        this.revenueToday = revenueToday;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getOrdersToday() {
        return ordersToday;
    }

    public void setOrdersToday(long ordersToday) {
        this.ordersToday = ordersToday;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getPendingReturnsCount() {
        return pendingReturnsCount;
    }

    public void setPendingReturnsCount(long pendingReturnsCount) {
        this.pendingReturnsCount = pendingReturnsCount;
    }

    public long getOrdersToPrepareCount() {
        return ordersToPrepareCount;
    }

    public void setOrdersToPrepareCount(long ordersToPrepareCount) {
        this.ordersToPrepareCount = ordersToPrepareCount;
    }

    public long getPickupOrdersToday() {
        return pickupOrdersToday;
    }

    public void setPickupOrdersToday(long pickupOrdersToday) {
        this.pickupOrdersToday = pickupOrdersToday;
    }

    public List<Map<String, Object>> getRecentOrders() {
        return recentOrders;
    }

    public void setRecentOrders(List<Map<String, Object>> recentOrders) {
        this.recentOrders = recentOrders;
    }

    public List<Map<String, Object>> getLowStockItems() {
        return lowStockItems;
    }

    public void setLowStockItems(List<Map<String, Object>> lowStockItems) {
        this.lowStockItems = lowStockItems;
    }

    public List<Map<String, Object>> getTopSellingCategories() {
        return topSellingCategories;
    }

    public void setTopSellingCategories(List<Map<String, Object>> topSellingCategories) {
        this.topSellingCategories = topSellingCategories;
    }

    public List<Map<String, Object>> getDailySalesChart() {
        return dailySalesChart;
    }

    public void setDailySalesChart(List<Map<String, Object>> dailySalesChart) {
        this.dailySalesChart = dailySalesChart;
    }
}
