package com.dmart.service;

import com.dmart.dto.request.OrderCreateRequest;
import com.dmart.dto.request.OrderItemRequest;
import com.dmart.dto.request.OrderStatusUpdateRequest;
import com.dmart.entity.*;
import com.dmart.exception.BadRequestException;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.OrderRepository;
import com.dmart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PickupSlotService pickupSlotService;

    @Autowired
    private AuthService authService;

    private static final BigDecimal FREE_DELIVERY_THRESHOLD = new BigDecimal("500.00");
    private static final BigDecimal STANDARD_DELIVERY_FEE = new BigDecimal("29.00");

    @Transactional
    public Order createOrder(OrderCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create an empty order");
        }

        Order order = new Order();
        order.setUser(currentUser);
        order.setFulfillmentType(request.getFulfillmentType());
        order.setPaymentMethod(request.getPaymentMethod());
        order.setPaymentStatus(request.getPaymentMethod() == PaymentMethod.CASH_ON_DELIVERY ?
                PaymentStatus.PENDING : PaymentStatus.PAID);
        order.setStatus(OrderStatus.PLACED);

        // Store Pickup vs Home Delivery handling
        if (request.getFulfillmentType() == FulfillmentType.STORE_PICKUP) {
            if (request.getPickupSlotId() == null) {
                throw new BadRequestException("Please select a pickup time slot for Store Pickup");
            }
            PickupSlot slot = pickupSlotService.bookSlot(request.getPickupSlotId());
            order.setPickupSlot(slot);
            order.setDeliveryFee(BigDecimal.ZERO);
        } else {
            if (request.getDeliveryAddress() == null || request.getDeliveryAddress().trim().isEmpty()) {
                throw new BadRequestException("Delivery address is required for Home Delivery");
            }
            order.setDeliveryAddress(request.getDeliveryAddress());
            order.setDeliveryPhone(request.getDeliveryPhone() != null ? request.getDeliveryPhone() : currentUser.getPhone());
            order.setDeliveryPincode(request.getDeliveryPincode() != null ? request.getDeliveryPincode() : currentUser.getPincode());
            order.setDeliveryNotes(request.getDeliveryNotes());
        }

        BigDecimal totalMrp = BigDecimal.ZERO;
        BigDecimal totalSubtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            if (!product.getIsActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is currently unavailable");
            }

            if (product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for '" + product.getName() + "'. Available: " + product.getStockQuantity());
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = new OrderItem(product, itemReq.getQuantity());
            order.addItem(orderItem);

            totalMrp = totalMrp.add(product.getMrp().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            totalSubtotal = totalSubtotal.add(orderItem.getSubtotal());
        }

        BigDecimal discount = totalMrp.subtract(totalSubtotal);
        order.setTotalMrp(totalMrp);
        order.setTotalDiscount(discount.compareTo(BigDecimal.ZERO) > 0 ? discount : BigDecimal.ZERO);

        // Delivery Fee logic
        if (request.getFulfillmentType() == FulfillmentType.HOME_DELIVERY) {
            if (totalSubtotal.compareTo(FREE_DELIVERY_THRESHOLD) >= 0) {
                order.setDeliveryFee(BigDecimal.ZERO);
            } else {
                order.setDeliveryFee(STANDARD_DELIVERY_FEE);
            }
        }

        order.setFinalAmount(totalSubtotal.add(order.getDeliveryFee()));
        order.setOrderNumber(generateOrderNumber());

        return orderRepository.save(order);
    }

    public List<Order> getCurrentUserOrders() {
        User currentUser = authService.getCurrentUser();
        return orderRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    public Order getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        User currentUser = authService.getCurrentUser();
        // Allow access if owner, or staff/admin
        if (!order.getUser().getId().equals(currentUser.getId()) &&
                currentUser.getRole() == Role.ROLE_CUSTOMER) {
            throw new BadRequestException("Access denied: You do not own this order");
        }

        return order;
    }

    public Order getOrderByOrderNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderNumber));
    }

    @Transactional
    public Order cancelOrder(Long orderId, String reason) {
        Order order = getOrderById(orderId);

        if (!order.canBeCancelled()) {
            throw new BadRequestException("Order cannot be cancelled at status: " + order.getStatus() +
                    ". Orders can only be cancelled before preparation begins.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        order.setCancellationReason(reason != null ? reason : "Cancelled by user");

        // Restock inventory
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        // Release slot if pickup
        if (order.getFulfillmentType() == FulfillmentType.STORE_PICKUP && order.getPickupSlot() != null) {
            pickupSlotService.releaseSlot(order.getPickupSlot().getId());
        }

        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, OrderStatusUpdateRequest request) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        OrderStatus newStatus = request.getStatus();

        if (newStatus == OrderStatus.CANCELLED) {
            return cancelOrder(orderId, request.getCancellationReason());
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.DELIVERED || newStatus == OrderStatus.PICKED_UP) {
            order.setPaymentStatus(PaymentStatus.PAID);
        }

        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getStaffOrdersQueue() {
        // Active orders for preparation & dispatch
        return orderRepository.findByStatusInOrderByCreatedAtAsc(List.of(
                OrderStatus.PLACED,
                OrderStatus.CONFIRMED,
                OrderStatus.PREPARING,
                OrderStatus.READY_FOR_PICKUP,
                OrderStatus.OUT_FOR_DELIVERY
        ));
    }

    private String generateOrderNumber() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        int randPart = 1000 + new Random().nextInt(9000);
        return "DM-" + datePart + "-" + randPart;
    }
}
