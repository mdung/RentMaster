package com.rentmaster.dashboard;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/enhanced-dashboard")
    public ResponseEntity<Map<String, Object>> getEnhancedDashboard() {
        Map<String, Object> data = dashboardService.getEnhancedDashboardData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueData(
            @RequestParam(defaultValue = "monthly") String period) {
        Map<String, Object> data = dashboardService.getRevenueData(period);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Object>> getOccupancyData(
            @RequestParam(defaultValue = "monthly") String period) {
        Map<String, Object> data = dashboardService.getOccupancyData(period);
        return ResponseEntity.ok(data);
    }

    @GetMapping("/payment-methods")
    public ResponseEntity<Map<String, Object>> getPaymentMethodData() {
        Map<String, Object> data = dashboardService.getPaymentMethodData();
        return ResponseEntity.ok(data);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivities(
            @RequestParam(defaultValue = "20") int limit) {
        List<Map<String, Object>> activities = dashboardService.getRecentActivities(limit);
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/due-dates")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingDueDates(
            @RequestParam(defaultValue = "30") int days) {
        List<Map<String, Object>> dueDates = dashboardService.getUpcomingDueDates(days);
        return ResponseEntity.ok(dueDates);
    }

    @GetMapping("/quick-actions")
    public ResponseEntity<List<Map<String, Object>>> getQuickActions() {
        List<Map<String, Object>> actions = dashboardService.getQuickActions();
        return ResponseEntity.ok(actions);
    }

    @GetMapping("/widgets")
    public ResponseEntity<List<Map<String, Object>>> getDashboardWidgets() {
        List<Map<String, Object>> widgets = dashboardService.getDashboardWidgets();
        return ResponseEntity.ok(widgets);
    }

    @PutMapping("/widgets")
    public ResponseEntity<List<Map<String, Object>>> updateDashboardWidgets(
            @RequestBody List<Map<String, Object>> widgets) {
        List<Map<String, Object>> updatedWidgets = dashboardService.updateDashboardWidgets(widgets);
        return ResponseEntity.ok(updatedWidgets);
    }
}