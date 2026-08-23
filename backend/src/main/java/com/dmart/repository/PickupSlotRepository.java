package com.dmart.repository;

import com.dmart.entity.PickupSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PickupSlotRepository extends JpaRepository<PickupSlot, Long> {
    List<PickupSlot> findBySlotDateGreaterThanEqualAndIsActiveTrueOrderBySlotDateAscStartTimeAsc(LocalDate fromDate);
    List<PickupSlot> findBySlotDateAndIsActiveTrueOrderByStartTimeAsc(LocalDate slotDate);
    List<PickupSlot> findByStoreNameAndSlotDateGreaterThanEqualAndIsActiveTrue(String storeName, LocalDate fromDate);
}
