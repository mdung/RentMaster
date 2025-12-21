package com.rentmaster.property;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.math.BigDecimal;

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

    @Autowired
    private FileStorageService fileStorageService;

    // Property Images Methods
    public List<PropertyImage> getImagesByProperty(Long propertyId) {
        return propertyImageRepository.findByPropertyIdOrderByIsPrimaryDescUploadedAtDesc(propertyId);
    }

    public PropertyImage uploadImage(Long propertyId, MultipartFile file, String category, String description) {
        try {
            String filePath = fileStorageService.uploadFile(file, propertyId + "/images/");
            String fileUrl = fileStorageService.getFileUrl(filePath);

            PropertyImage image = new PropertyImage();
            image.setPropertyId(propertyId);
            String originalFilename = file.getOriginalFilename();
            image.setFilename(originalFilename != null ? originalFilename : "image");
            image.setOriginalFilename(originalFilename);
            image.setFilePath(filePath);
            image.setFileSize(file.getSize());
            image.setMimeType(file.getContentType());
            if (category != null) {
                try {
                    image.setImageType(PropertyImage.ImageType.valueOf(category.toUpperCase()));
                } catch (IllegalArgumentException e) {
                    image.setImageType(PropertyImage.ImageType.OTHER);
                }
            }
            if (description != null) {
                image.setCaption(description);
                image.setAltText(description);
            }
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
            String filePath = fileStorageService.uploadFile(file, propertyId + "/floor-plans/");
            String fileUrl = fileStorageService.getFileUrl(filePath);

            FloorPlan floorPlan = new FloorPlan();
            floorPlan.setPropertyId(propertyId);
            floorPlan.setName(name);
            String originalFilename = file.getOriginalFilename();
            floorPlan.setFilename(originalFilename != null ? originalFilename : "floor-plan");
            floorPlan.setOriginalFilename(originalFilename);
            floorPlan.setFilePath(filePath);
            floorPlan.setFileSize(file.getSize());
            floorPlan.setMimeType(file.getContentType());
            if (floor != null && !floor.isEmpty()) {
                try {
                    floorPlan.setFloorNumber(Integer.parseInt(floor));
                } catch (NumberFormatException e) {
                    // If floor is not a number, leave it null
                }
            }
            if (roomCount != null) {
                floorPlan.setBedrooms(roomCount); // Assuming roomCount maps to bedrooms
            }
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

        // Calculate next due date based on recurrence type
        if (schedule.getRecurrenceType() != null && schedule.getRecurrenceType() != MaintenanceSchedule.RecurrenceType.NONE) {
            LocalDate nextDueDate = calculateNextDueDate(schedule.getNextDueDate() != null ? schedule.getNextDueDate() : LocalDate.now(), schedule.getRecurrenceType());
            schedule.setNextDueDate(nextDueDate);
            schedule.setStatus(MaintenanceSchedule.Status.SCHEDULED);
        }

        // Update completion data if provided
        if (completionData != null) {
            if (completionData.containsKey("actualCost")) {
                schedule.setActualCost(Double.valueOf(completionData.get("actualCost").toString()));
            }
            if (completionData.containsKey("completedBy")) {
                schedule.setCompletedBy(completionData.get("completedBy").toString());
            }
            if (completionData.containsKey("completionNotes")) {
                schedule.setCompletionNotes(completionData.get("completionNotes").toString());
            }
        }

        maintenanceScheduleRepository.save(schedule);
    }

    private LocalDate calculateNextDueDate(LocalDate currentDate, MaintenanceSchedule.RecurrenceType recurrenceType) {
        if (recurrenceType == null) {
            return currentDate.plusMonths(1);
        }
        
        switch (recurrenceType) {
            case DAILY:
                return currentDate.plusDays(1);
            case WEEKLY:
                return currentDate.plusWeeks(1);
            case MONTHLY:
                return currentDate.plusMonths(1);
            case QUARTERLY:
                return currentDate.plusMonths(3);
            case SEMI_ANNUALLY:
                return currentDate.plusMonths(6);
            case ANNUALLY:
                return currentDate.plusYears(1);
            case NONE:
            case CUSTOM:
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
            return propertyAnalyticsRepository.findByPropertyIdAndDateRange(propertyId, LocalDate.parse(startDate),
                    LocalDate.parse(endDate));
        }
        return propertyAnalyticsRepository.findByPropertyIdOrderByMetricDateDesc(propertyId);
    }

    public Map<String, Object> getPropertyComparison(List<Long> propertyIds) {
        Map<String, Object> comparison = new HashMap<>();

        for (Long propertyId : propertyIds) {
            // Get all analytics for the property
            List<PropertyAnalytics> analytics = propertyAnalyticsRepository
                    .findByPropertyIdOrderByMetricDateDesc(propertyId);

            if (!analytics.isEmpty()) {
                // Group by date/month to find the latest set of metrics
                // Assuming we want the most recent month across all data
                Map<LocalDate, List<PropertyAnalytics>> byDate = analytics.stream()
                        .collect(Collectors.groupingBy(PropertyAnalytics::getMetricDate));

                Optional<LocalDate> latestDate = byDate.keySet().stream().max(Comparator.naturalOrder());

                if (latestDate.isPresent()) {
                    List<PropertyAnalytics> latestMetrics = byDate.get(latestDate.get());
                    Map<String, Object> propertyData = new HashMap<>();

                    // Default values
                    propertyData.put("occupancyRate", 0.0);
                    propertyData.put("averageRent", 0.0);
                    propertyData.put("totalRevenue", 0.0);
                    propertyData.put("maintenanceCosts", 0.0);
                    propertyData.put("profitMargin", 0.0);
                    propertyData.put("tenantSatisfaction", 0.0);
                    propertyData.put("renewalRate", 0.0);

                    // Populate with actual values
                    for (PropertyAnalytics metric : latestMetrics) {
                        if (metric.getValue() != null) {
                            switch (metric.getMetricType()) {
                                case OCCUPANCY_RATE:
                                    propertyData.put("occupancyRate", metric.getValue());
                                    break;
                                case AVERAGE_RENT:
                                    propertyData.put("averageRent", metric.getValue());
                                    break;
                                case RENTAL_INCOME: // Assuming TOTAL_REVENUE maps to RENTAL_INCOME or similar
                                    propertyData.put("totalRevenue", metric.getValue());
                                    break;
                                case MAINTENANCE_COST:
                                    propertyData.put("maintenanceCosts", metric.getValue());
                                    break;
                                case PROFIT_MARGIN:
                                    propertyData.put("profitMargin", metric.getValue());
                                    break;
                                case TENANT_SATISFACTION:
                                    propertyData.put("tenantSatisfaction", metric.getValue());
                                    break;
                                case RENEWAL_RATE:
                                    propertyData.put("renewalRate", metric.getValue());
                                    break;
                                default:
                                    // Ignore other metrics for comparison summary
                                    break;
                            }
                        }
                    }
                    comparison.put("property_" + propertyId, propertyData);
                }
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