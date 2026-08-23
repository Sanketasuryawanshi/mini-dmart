package com.dmart.service;

import com.dmart.dto.request.SlotCreateRequest;
import com.dmart.entity.PickupSlot;
import com.dmart.exception.BadRequestException;
import com.dmart.exception.ResourceNotFoundException;
import com.dmart.repository.PickupSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class PickupSlotService {

    @Autowired
    private PickupSlotRepository pickupSlotRepository;

    public List<PickupSlot> getAvailableSlots() {
        return pickupSlotRepository.findBySlotDateGreaterThanEqualAndIsActiveTrueOrderBySlotDateAscStartTimeAsc(LocalDate.now());
    }

    public List<PickupSlot> getSlotsByDate(LocalDate date) {
        return pickupSlotRepository.findBySlotDateAndIsActiveTrueOrderByStartTimeAsc(date);
    }

    public PickupSlot getSlotById(Long id) {
        return pickupSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pickup slot not found with id: " + id));
    }

    @Transactional
    public PickupSlot bookSlot(Long slotId) {
        PickupSlot slot = getSlotById(slotId);
        if (!slot.isAvailable()) {
            throw new BadRequestException("Selected pickup slot is already at full capacity. Please choose another time slot.");
        }
        slot.setBookedCount(slot.getBookedCount() + 1);
        return pickupSlotRepository.save(slot);
    }

    @Transactional
    public void releaseSlot(Long slotId) {
        if (slotId != null) {
            pickupSlotRepository.findById(slotId).ifPresent(slot -> {
                if (slot.getBookedCount() > 0) {
                    slot.setBookedCount(slot.getBookedCount() - 1);
                    pickupSlotRepository.save(slot);
                }
            });
        }
    }

    @Transactional
    public PickupSlot createSlot(SlotCreateRequest request) {
        PickupSlot slot = new PickupSlot(
                request.getStoreName(),
                request.getStoreAddress(),
                request.getSlotDate(),
                request.getStartTime(),
                request.getEndTime(),
                request.getMaxCapacity()
        );
        return pickupSlotRepository.save(slot);
    }

    @Transactional
    public void toggleSlotStatus(Long id, boolean active) {
        PickupSlot slot = getSlotById(id);
        slot.setIsActive(active);
        pickupSlotRepository.save(slot);
    }
}
