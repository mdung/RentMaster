package com.rentmaster.property;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/property-management")
@CrossOrigin(origins = "*")
public class PropertyManagementController {

    @Autowired
    private PropertyAdvancedService propertyAdvancedService;

    // Property Amenities
    @GetMapping("/{propertyId}/amenities")
    public ResponseEntity<List<PropertyAmenity>> getAmenities(@PathVariable Long propertyId) {
        List<PropertyAmenity> amenities = propertyAdvancedService.getAmenitiesByProperty(propertyId);
        return ResponseEntity.ok(amenities);
    }

    @PostMapping("/{propertyId}/amenities")
    public ResponseEntity<PropertyAmenity> createAmenity(@PathVariable Long propertyId, @RequestBody PropertyAmenity amenity) {
        amenity.setPropertyId(propertyId);
        PropertyAmenity created = propertyAdvancedService.createAmenity(amenity);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{propertyId}/amenities/{amenityId}")
    public ResponseEntity<PropertyAmenity> updateAmenity(@PathVariable Long propertyId, @PathVariable Long amenityId, @RequestBody PropertyAmenity amenity) {
        amenity.setId(amenityId);
        amenity.setPropertyId(propertyId);
        PropertyAmenity updated = propertyAdvancedService.updateAmenity(amenity);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{propertyId}/amenities/{amenityId}")
    public ResponseEntity<Void> deleteAmenity(@PathVariable Long propertyId, @PathVariable Long amenityId) {
        propertyAdvancedService.deleteAmenity(amenityId);
        return ResponseEntity.ok().build();
    }

    // Property Images
    @GetMapping("/{propertyId}/images")
    public ResponseEntity<List<PropertyImage>> getImages(@PathVariable Long propertyId) {
        List<PropertyImage> images = propertyAdvancedService.getImagesByProperty(propertyId);
        return ResponseEntity.ok(images);
    }

    @PostMapping("/{propertyId}/images")
    public ResponseEntity<PropertyImage> uploadImage(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("category") String category,
            @RequestParam(value = "description", required = false) String description) {
        PropertyImage image = propertyAdvancedService.uploadImage(propertyId, file, category, description);
        return ResponseEntity.ok(image);
    }

    @PutMapping("/{propertyId}/images/{imageId}")
    public ResponseEntity<PropertyImage> updateImage(@PathVariable Long propertyId, @PathVariable Long imageId, @RequestBody PropertyImage image) {
        image.setId(imageId);
        image.setPropertyId(propertyId);
        PropertyImage updated = propertyAdvancedService.updateImage(image);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{propertyId}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long propertyId, @PathVariable Long imageId) {
        propertyAdvancedService.deleteImage(imageId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{propertyId}/images/{imageId}/set-primary")
    public ResponseEntity<Void> setPrimaryImage(@PathVariable Long propertyId, @PathVariable Long imageId) {
        propertyAdvancedService.setPrimaryImage(propertyId, imageId);
        return ResponseEntity.ok().build();
    }

    // Floor Plans
    @GetMapping("/{propertyId}/floor-plans")
    public ResponseEntity<List<FloorPlan>> getFloorPlans(@PathVariable Long propertyId) {
        List<FloorPlan> floorPlans = propertyAdvancedService.getFloorPlansByProperty(propertyId);
        return ResponseEntity.ok(floorPlans);
    }

    @PostMapping("/{propertyId}/floor-plans")
    public ResponseEntity<FloorPlan> uploadFloorPlan(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file,
            @RequestParam("name") String name,
            @RequestParam("floor") String floor,
            @RequestParam("roomCount") Integer roomCount,
            @RequestParam("totalArea") Double totalArea,
            @RequestParam(value = "description", required = false) String description) {
        FloorPlan floorPlan = propertyAdvancedService.uploadFloorPlan(propertyId, file, name, floor, roomCount, totalArea, description);
        return ResponseEntity.ok(floorPlan);
    }

    @PutMapping("/{propertyId}/floor-plans/{floorPlanId}")
    public ResponseEntity<FloorPlan> updateFloorPlan(@PathVariable Long propertyId, @PathVariable Long floorPlanId, @RequestBody FloorPlan floorPlan) {
        floorPlan.setId(floorPlanId);
        floorPlan.setPropertyId(propertyId);
        FloorPlan updated = propertyAdvancedService.updateFloorPlan(floorPlan);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{propertyId}/floor-plans/{floorPlanId}")
    public ResponseEntity<Void> deleteFloorPlan(@PathVariable Long propertyId, @PathVariable Long floorPlanId) {
        propertyAdvancedService.deleteFloorPlan(floorPlanId);
        return ResponseEntity.ok().build();
    }

    // Maintenance Schedules
    @GetMapping("/{propertyId}/maintenance-schedules")
    public ResponseEntity<List<MaintenanceSchedule>> getMaintenanceSchedules(@PathVariable Long propertyId) {
        List<MaintenanceSchedule> schedules = propertyAdvancedService.getMaintenanceSchedulesByProperty(propertyId);
        return ResponseEntity.ok(schedules);
    }

    @PostMapping("/{propertyId}/maintenance-schedules")
    public ResponseEntity<MaintenanceSchedule> createMaintenanceSchedule(@PathVariable Long propertyId, @RequestBody MaintenanceSchedule schedule) {
        schedule.setPropertyId(propertyId);
        MaintenanceSchedule created = propertyAdvancedService.createMaintenanceSchedule(schedule);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{propertyId}/maintenance-schedules/{scheduleId}")
    public ResponseEntity<MaintenanceSchedule> updateMaintenanceSchedule(@PathVariable Long propertyId, @PathVariable Long scheduleId, @RequestBody MaintenanceSchedule schedule) {
        schedule.setId(scheduleId);
        schedule.setPropertyId(propertyId);
        MaintenanceSchedule updated = propertyAdvancedService.updateMaintenanceSchedule(schedule);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{propertyId}/maintenance-schedules/{scheduleId}")
    public ResponseEntity<Void> deleteMaintenanceSchedule(@PathVariable Long propertyId, @PathVariable Long scheduleId) {
        propertyAdvancedService.deleteMaintenanceSchedule(scheduleId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{propertyId}/maintenance-schedules/{scheduleId}/complete")
    public ResponseEntity<Void> completeMaintenanceTask(@PathVariable Long propertyId, @PathVariable Long scheduleId, @RequestBody Map<String, Object> completionData) {
        propertyAdvancedService.completeMaintenanceTask(scheduleId, completionData);
        return ResponseEntity.ok().build();
    }

    // Vendors
    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getVendors() {
        List<Vendor> vendors = propertyAdvancedService.getAllVendors();
        return ResponseEntity.ok(vendors);
    }

    @PostMapping("/vendors")
    public ResponseEntity<Vendor> createVendor(@RequestBody Vendor vendor) {
        Vendor created = propertyAdvancedService.createVendor(vendor);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/vendors/{vendorId}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long vendorId, @RequestBody Vendor vendor) {
        vendor.setId(vendorId);
        Vendor updated = propertyAdvancedService.updateVendor(vendor);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/vendors/{vendorId}")
    public ResponseEntity<Void> deleteVendor(@PathVariable Long vendorId) {
        propertyAdvancedService.deleteVendor(vendorId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/vendors/{vendorId}/rate")
    public ResponseEntity<Void> rateVendor(@PathVariable Long vendorId, @RequestBody Map<String, Object> ratingData) {
        Integer rating = (Integer) ratingData.get("rating");
        String feedback = (String) ratingData.get("feedback");
        propertyAdvancedService.rateVendor(vendorId, rating, feedback);
        return ResponseEntity.ok().build();
    }

    // Property Analytics
    @GetMapping("/{propertyId}/analytics")
    public ResponseEntity<List<PropertyAnalytics>> getPropertyAnalytics(
            @PathVariable Long propertyId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<PropertyAnalytics> analytics = propertyAdvancedService.getPropertyAnalytics(propertyId, startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/analytics/comparison")
    public ResponseEntity<Map<String, Object>> getPropertyComparison(@RequestBody Map<String, List<Long>> request) {
        List<Long> propertyIds = request.get("propertyIds");
        Map<String, Object> comparison = propertyAdvancedService.getPropertyComparison(propertyIds);
        return ResponseEntity.ok(comparison);
    }

    // Room Management
    @GetMapping("/{propertyId}/rooms")
    public ResponseEntity<List<Map<String, Object>>> getRoomsByProperty(@PathVariable Long propertyId) {
        List<Map<String, Object>> rooms = propertyAdvancedService.getRoomsByProperty(propertyId);
        return ResponseEntity.ok(rooms);
    }

    @PutMapping("/{propertyId}/rooms/{roomId}/status")
    public ResponseEntity<Void> updateRoomStatus(@PathVariable Long propertyId, @PathVariable Long roomId, @RequestBody Map<String, String> statusUpdate) {
        String status = statusUpdate.get("status");
        propertyAdvancedService.updateRoomStatus(roomId, status);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{propertyId}/rooms/bulk-update")
    public ResponseEntity<Void> bulkUpdateRooms(@PathVariable Long propertyId, @RequestBody Map<String, List<Map<String, Object>>> request) {
        List<Map<String, Object>> updates = request.get("updates");
        propertyAdvancedService.bulkUpdateRooms(propertyId, updates);
        return ResponseEntity.ok().build();
    }
}