package com.dmart.repository;

import com.dmart.entity.ReturnRequest;
import com.dmart.entity.ReturnStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReturnRequestRepository extends JpaRepository<ReturnRequest, Long> {
    List<ReturnRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<ReturnRequest> findByOrderId(Long orderId);
    List<ReturnRequest> findAllByOrderByCreatedAtDesc();
    List<ReturnRequest> findByStatusOrderByCreatedAtAsc(ReturnStatus status);
    long countByStatus(ReturnStatus status);
}
