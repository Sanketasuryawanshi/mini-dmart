package com.dmart.service;

import com.dmart.dto.request.ReturnCreateRequest;
import com.dmart.dto.request.ReturnItemRequest;
import com.dmart.dto.request.ReturnProcessRequest;
import com.dmart.entity.*;
import com.dmart.exception.BadRequestException;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.OrderRepository;
import com.dmart.repository.ProductRepository;
import com.dmart.repository.ReturnRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReturnService {

    @Autowired
    private ReturnRequestRepository returnRequestRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AuthService authService;

    @Transactional
    public ReturnRequest createReturnRequest(ReturnCreateRequest request) {
        User currentUser = authService.getCurrentUser();

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + request.getOrderId()));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You can only request returns for your own orders");
        }

        // Business Rule 1: Order must be delivered or picked up
        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.PICKED_UP) {
            throw new BadRequestException("Returns & Exchanges are only permitted on delivered/completed orders");
        }

        // Business Rule 2: 7-day return window
        if (order.getCreatedAt().isBefore(LocalDateTime.now().minusDays(7))) {
            throw new BadRequestException("Return window has expired. Returns must be requested within 7 days of order placement.");
        }

        ReturnRequest returnReq = new ReturnRequest();
        returnReq.setOrder(order);
        returnReq.setUser(currentUser);
        returnReq.setRequestType(request.getRequestType());
        returnReq.setReason(request.getReason());
        returnReq.setCustomerComments(request.getCustomerComments());
        returnReq.setStatus(ReturnStatus.PENDING);

        BigDecimal calculatedRefund = BigDecimal.ZERO;

        for (ReturnItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + itemReq.getProductId()));

            // Find matching item in order
            OrderItem orderItem = order.getItems().stream()
                    .filter(oi -> oi.getProduct().getId().equals(product.getId()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("Product '" + product.getName() + "' is not part of this order"));

            if (itemReq.getQuantity() > orderItem.getQuantity()) {
                throw new BadRequestException("Return quantity (" + itemReq.getQuantity() +
                        ") cannot exceed ordered quantity (" + orderItem.getQuantity() + ")");
            }

            // Perishable Item Rule: Perishable items only returnable if damaged/expired
            if (product.getIsPerishable() &&
                    request.getReason() != ReturnReason.DEFECTIVE_DAMAGED &&
                    request.getReason() != ReturnReason.EXPIRED) {
                throw new BadRequestException("Perishable grocery item '" + product.getName() +
                        "' is only eligible for return/exchange if damaged or expired.");
            }

            ReturnItem returnItem = new ReturnItem(product, itemReq.getQuantity(), itemReq.getItemAction());
            returnReq.addItem(returnItem);

            calculatedRefund = calculatedRefund.add(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
        }

        returnReq.setRefundAmount(calculatedRefund);
        return returnRequestRepository.save(returnReq);
    }

    public List<ReturnRequest> getCurrentUserReturnRequests() {
        User currentUser = authService.getCurrentUser();
        return returnRequestRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId());
    }

    public List<ReturnRequest> getAllReturnRequests() {
        return returnRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public ReturnRequest getReturnRequestById(Long id) {
        return returnRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Return request not found with id: " + id));
    }

    @Transactional
    public ReturnRequest processReturnRequest(Long id, ReturnProcessRequest request) {
        ReturnRequest returnReq = getReturnRequestById(id);

        returnReq.setStatus(request.getStatus());
        returnReq.setStaffNotes(request.getStaffNotes());
        returnReq.setRestockInventory(request.getRestockInventory());
        returnReq.setResolvedAt(LocalDateTime.now());

        // If approved and restock is enabled, return stock back to inventory
        if (request.getStatus() == ReturnStatus.APPROVED && Boolean.TRUE.equals(request.getRestockInventory())) {
            for (ReturnItem item : returnReq.getItems()) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        return returnRequestRepository.save(returnReq);
    }
}
