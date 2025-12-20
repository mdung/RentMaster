package com.rentmaster.property;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PropertyAdvancedService {

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    @Autowired
    private FloorPlanRepository floorPlanRepository;

    @Autowired
    private PropertyAmenityRepository propertyAmenityRepository;

    @Autowired
    private MaintenanceScheduleRepository maintenanceScheduleRepository;

    @Autowired
    private VendorRepository vendorRepository;

    @Autowired
    private PropertyAnalyticsRepository propertyAnalyticsRepository;

    @Autowired
    private RoomRepository roomRepository;

    private final String UPLOAD_DIR = "./uploads/properties/";

    // Property Images Methods
    public List<PropertyImage> getImagesByProperty(Long propertyId) {
        return propertyImageRepository.findByPropertyIdOrderByIsPrimaryDescUploadedAtDesc(propertyId);
    }

    public PropertyImage uploadImage(Long propertyId, MultipartFile file, String category, String description) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR + propertyId + "/images/");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            PropertyImage image = new PropertyImage();
            image.setPropertyId(propertyId);
            image.setFilename(fileName);
            image.setOriginalFilename(file.getOriginalFilename());
            image.setFilePath(filePath.toString());
            image.setFileSize(file.getSize());
            image.setMimeType(file.getContentType());

            try {
                image.setImageType(PropertyImage.ImageType.valueOf(category.toUpperCase()));
            } catch (Exception e) {
                image.setImageType(PropertyImage.ImageType.OTHER);
            }

            image.setCaption(description);
            image.setUploadedAt(LocalDateTime.now());

            return propertyImageRepository.save(image);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image: " + e.getMessage());
        }
    }

    public PropertyImage updateImage(PropertyImage image) {
        return propertyImageRepository.save(image);
    }

    public void deleteImage(Long imageId) {
        propertyImageRepository.deleteById(imageId);
    }

    public void setPrimaryImage(Long propertyId, Long imageId) {
        propertyImageRepository.clearPrimaryImages(propertyId);
        PropertyImage image = propertyImageRepository.findById(imageId).orElseThrow();
        image.setIsPrimary(true);
        propertyImageRepository.save(image);
    }

    // Floor Plans Methods
    public List<FloorPlan> getFloorPlansByProperty(Long propertyId) {
        return floorPlanRepository.findByPropertyIdOrderByFloorNumberAsc(propertyId);
    }

    public FloorPlan uploadFloorPlan(Long propertyId, MultipartFile file, String name, String floor, Integer roomCount,
            Double totalArea, String description) {
        try {
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path uploadPath = Paths.get(UPLOAD_DIR + propertyId + "/floor-plans/");
            Files.createDirectories(uploadPath);

            Path filePath = uploadPath.resolve(fileName);
            Files.write(filePath, file.getBytes());

            FloorPlan floorPlan = new FloorPlan();
            floorPlan.setPropertyId(propertyId);
            floorPlan.setName(name);
            floorPlan.setFilename(fileName);
            floorPlan.setFilePath(filePath.toString());
            floorPlan.setFileSize(file.getSize());
            try {
                if (floor != null)
                    floorPlan.setFloorNumber(Integer.parseInt(floor.replaceAll("\\D", "")));
            } catch (Exception e) {
                floorPlan.setFloorNumber(0);
            }
            floorPlan.setBedrooms(roomCount);
            floorPlan.setTotalArea(totalArea);
            floorPlan.setDescription(description);
            floorPlan.setUploadedAt(LocalDateTime.now());

            return floorPlanRepository.save(floorPlan);
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload floor plan: " + e.getMessage());
        }
    }

    public FloorPlan updateFloorPlan(FloorPlan floorPlan) {
        return floorPlanRepository.save(floorPlan);
    }

    public void deleteFloorPlan(Long floorPlanId) {
        floorPlanRepository.deleteById(floorPlanId);
    }

    // Property Amenities Methods
    public List<PropertyAmenity> getAmenitiesByProperty(Long propertyId) {
        return propertyAmenityRepository.findByPropertyIdOrderByCategoryAscNameAsc(propertyId);
    }

    public PropertyAmenity createAmenity(PropertyAmenity amenity) {
        return propertyAmenityRepository.save(amenity);
    }

    public PropertyAmenity updateAmenity(PropertyAmenity amenity) {
        return propertyAmenityRepository.save(amenity);
    }

    public void deleteAmenity(Long amenityId) {
        propertyAmenityRepository.deleteById(amenityId);
    }

    // Maintenance Schedules Methods
    public List<MaintenanceSchedule> getMaintenanceSchedulesByProperty(Long propertyId) {
        return maintenanceScheduleRepository.findByPropertyIdOrderByNextDueDateAsc(propertyId);
    }

    public MaintenanceSchedule createMaintenanceSchedule(MaintenanceSchedule schedule) {
        return maintenanceScheduleRepository.save(schedule);
    }

    public MaintenanceSchedule updateMaintenanceSchedule(MaintenanceSchedule schedule) {
        return maintenanceScheduleRepository.save(schedule);
    }

    public void deleteMaintenanceSchedule(Long scheduleId) {
        maintenanceScheduleRepository.deleteById(scheduleId);
    }

    public void completeMaintenanceTask(Long scheduleId, Map<String, Object> completionData) {
        MaintenanceSchedule schedule = maintenanceScheduleRepository.findById(scheduleId).orElseThrow();
        schedule.setCompletedDate(LocalDateTime.now());
        schedule.setStatus(MaintenanceSchedule.Status.COMPLETED);

        // Calculate next due date based on frequency
        if (schedule.getRecurrenceType() != null
                && schedule.getRecurrenceType() != MaintenanceSchedule.RecurrenceType.NONE) {
            LocalDate nextDueDate = calculateNextDueDate(schedule.getNextDueDate(),
                    schedule.getRecurrenceType().name());
            schedule.setNextDueDate(nextDueDate);
            schedule.setStatus(MaintenanceSchedule.Status.SCHEDULED);
        }

        maintenanceScheduleRepository.save(schedule);
    }

    private LocalDate calculateNextDueDate(LocalDate currentDate, String frequency) {
        switch (frequency.toUpperCase()) {
            case "DAILY":
                return currentDate.plusDays(1);
            case "WEEKLY":
                return currentDate.plusWeeks(1);
            case "BIWEEKLY":
                return currentDate.plusWeeks(2);
            case "MONTHLY":
                return currentDate.plusMonths(1);
            case "QUARTERLY":
                return currentDate.plusMonths(3);
            case "SEMI_ANNUALLY":
                return currentDate.plusMonths(6);
            case "ANNUALLY":
                return currentDate.plusYears(1);
            default:
                return currentDate.plusMonths(1);
        }
    }

    // Vendors Methods
    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor createVendor(Vendor vendor) {
        vendor.setRating(0.0);
        vendor.setTotalJobs(0);
        vendor.setAverageCost(0.0);
        return vendorRepository.save(vendor);
    }

    public Vendor updateVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(Long vendorId) {
        vendorRepository.deleteById(vendorId);
    }

    public void rateVendor(Long vendorId, Integer rating, String feedback) {
        Vendor vendor = vendorRepository.findById(vendorId).orElseThrow();

        // Calculate new average rating
        double currentTotal = vendor.getRating() * vendor.getTotalJobs();
        int newTotalJobs = vendor.getTotalJobs() + 1;
        double newRating = (currentTotal + rating) / newTotalJobs;

        vendor.setRating(newRating);
        vendor.setTotalJobs(newTotalJobs);

        vendorRepository.save(vendor);
    }

    // Property Analytics Methods
    public List<PropertyAnalytics> getPropertyAnalytics(Long propertyId, String startDate, String endDate) {
        if (startDate != null && endDate != null) {
            try {
                LocalDate start = LocalDate.parse(startDate);
                LocalDate end = LocalDate.parse(endDate);
                return propertyAnalyticsRepository.findByPropertyIdAndDateRange(propertyId, start, end);
            } catch (Exception e) {
                // Fallback or error
                return Collections.emptyList();
            }
        }
        return propertyAnalyticsRepository.findByPropertyIdOrderByMetricDateDesc(propertyId);
    }

    public Map<String, Object> getPropertyComparison(List<Long> propertyIds) {
        Map<String, Object> comparison = new HashMap<>();

        for (Long propertyId : propertyIds) {
            List<PropertyAnalytics> analytics = propertyAnalyticsRepository.findByPropertyId(propertyId);

            Map<PropertyAnalytics.MetricType, Double> latestMetrics = analytics.stream()
                    .filter(a -> a.getMetricType() != null)
                    .collect(Collectors.groupingBy(
                            PropertyAnalytics::getMetricType,
                            Collectors.collectingAndThen(
                                    Collectors.maxBy(Comparator.comparing(PropertyAnalytics::getMetricDate)),
                                    opt -> opt.map(PropertyAnalytics::getValue).orElse(0.0))));

            if (!latestMetrics.isEmpty()) {
                Map<String, Object> propertyData = new HashMap<>();
                propertyData.put("occupancyRate", latestMetrics.get(PropertyAnalytics.MetricType.OCCUPANCY_RATE));
                propertyData.put("averageRent", latestMetrics.get(PropertyAnalytics.MetricType.AVERAGE_RENT));
                propertyData.put("totalRevenue", latestMetrics.get(PropertyAnalytics.MetricType.RENTAL_INCOME));
                propertyData.put("maintenanceCosts", latestMetrics.get(PropertyAnalytics.MetricType.MAINTENANCE_COST));
                propertyData.put("profitMargin", latestMetrics.get(PropertyAnalytics.MetricType.PROFIT_MARGIN));
                propertyData.put("tenantSatisfaction",
                        latestMetrics.get(PropertyAnalytics.MetricType.TENANT_SATISFACTION));
                propertyData.put("renewalRate", 0.0);

                comparison.put("property_" + propertyId, propertyData);
            }
        }

        return comparison;
    }

    // Room Management Methods
    public List<Map<String, Object>> getRoomsByProperty(Long propertyId) {
        List<Room> rooms = roomRepository.findByPropertyId(propertyId);

        return rooms.stream().map(room -> {
            Map<String, Object> roomData = new HashMap<>();
            roomData.put("id", room.getId());
            roomData.put("code", room.getCode());
            roomData.put("floor", room.getFloor());
            roomData.put("type", room.getType());
            roomData.put("sizeM2", room.getSizeM2());
            roomData.put("status", room.getStatus());
            roomData.put("baseRent", room.getBaseRent());
            roomData.put("capacity", room.getCapacity());
            roomData.put("notes", room.getNotes());
            return roomData;
        }).collect(Collectors.toList());
    }

    public void updateRoomStatus(Long roomId, String status) {
        Room room = roomRepository.findById(roomId).orElseThrow();
        room.setStatus(RoomStatus.valueOf(status));
        roomRepository.save(room);
    }

    public void bulkUpdateRooms(Long propertyId, List<Map<String, Object>> updates) {
        for (Map<String, Object> update : updates) {
            Long roomId = Long.valueOf(update.get("roomId").toString());
            Room room = roomRepository.findById(roomId).orElseThrow();

            if (update.containsKey("status")) {
                room.setStatus(RoomStatus.valueOf(update.get("status").toString()));
            }
            if (update.containsKey("baseRent")) {
                room.setBaseRent(new BigDecimal(update.get("baseRent").toString()));
            }
            if (update.containsKey("notes")) {
                room.setNotes(update.get("notes").toString());
            }

            roomRepository.save(room);
        }
    }

}