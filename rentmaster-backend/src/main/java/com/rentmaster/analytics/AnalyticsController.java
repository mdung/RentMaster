package com.rentmaster.analytics;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@CrossOrigin(origins = "*")
public class AnalyticsController {
    
    @Autowired
    private AnalyticsService analyticsService;
    
    /**
     * Get comprehensive dashboard analytics
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboardAnalytics(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> analytics = analyticsService.getDashboardAnalytics(months, propertyId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get revenue analytics and trends
     */
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueAnalytics(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(defaultValue = "monthly") String granularity) {
        try {
            Map<String, Object> analytics = analyticsService.getRevenueAnalytics(months, propertyId, granularity);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get occupancy analytics and trends
     */
    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Object>> getOccupancyAnalytics(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> analytics = analyticsService.getOccupancyAnalytics(months, propertyId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get financial performance analytics
     */
    @GetMapping("/financial-performance")
    public ResponseEntity<Map<String, Object>> getFinancialPerformance(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> analytics = analyticsService.getFinancialPerformance(months, propertyId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get tenant analytics
     */
    @GetMapping("/tenants")
    public ResponseEntity<Map<String, Object>> getTenantAnalytics(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> analytics = analyticsService.getTenantAnalytics(months, propertyId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get maintenance analytics
     */
    @GetMapping("/maintenance")
    public ResponseEntity<Map<String, Object>> getMaintenanceAnalytics(
            @RequestParam(defaultValue = "12") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> analytics = analyticsService.getMaintenanceAnalytics(months, propertyId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get comparative analytics (year-over-year)
     */
    @GetMapping("/comparative")
    public ResponseEntity<Map<String, Object>> getComparativeAnalytics(
            @RequestParam String currentPeriod,
            @RequestParam String comparisonPeriod,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> analytics = analyticsService.getComparativeAnalytics(currentPeriod, comparisonPeriod, propertyId);
            return ResponseEntity.ok(analytics);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get forecasting data
     */
    @GetMapping("/forecasting")
    public ResponseEntity<Map<String, Object>> getForecasting(
            @RequestParam(defaultValue = "12") int forecastMonths,
            @RequestParam(required = false) Long propertyId,
            @RequestParam(defaultValue = "revenue,occupancy,expenses") String metrics) {
        try {
            Map<String, Object> forecasting = analyticsService.getForecasting(forecastMonths, propertyId, metrics);
            return ResponseEntity.ok(forecasting);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get property performance heatmap
     */
    @GetMapping("/heatmap")
    public ResponseEntity<Map<String, Object>> getPropertyHeatmap(
            @RequestParam String metric,
            @RequestParam(defaultValue = "12") int months) {
        try {
            Map<String, Object> heatmap = analyticsService.getPropertyHeatmap(metric, months);
            return ResponseEntity.ok(heatmap);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Create custom report
     */
    @PostMapping("/custom-reports")
    public ResponseEntity<Map<String, Object>> createCustomReport(@RequestBody Map<String, Object> reportConfig) {
        try {
            Map<String, Object> report = analyticsService.createCustomReport(reportConfig);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get saved custom reports
     */
    @GetMapping("/custom-reports")
    public ResponseEntity<List<Map<String, Object>>> getCustomReports(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        try {
            List<Map<String, Object>> reports = analyticsService.getCustomReports(page, size);
            return ResponseEntity.ok(reports);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Execute custom report
     */
    @PostMapping("/custom-reports/{id}/execute")
    public ResponseEntity<Map<String, Object>> executeCustomReport(@PathVariable Long id) {
        try {
            Map<String, Object> report = analyticsService.executeCustomReport(id);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get KPI metrics
     */
    @GetMapping("/kpis")
    public ResponseEntity<Map<String, Object>> getKPIMetrics(
            @RequestParam(required = false) Long propertyId,
            @RequestParam(defaultValue = "current_month") String period) {
        try {
            Map<String, Object> kpis = analyticsService.getKPIMetrics(propertyId, period);
            return ResponseEntity.ok(kpis);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Get trend analysis
     */
    @GetMapping("/trends")
    public ResponseEntity<Map<String, Object>> getTrendAnalysis(
            @RequestParam String metric,
            @RequestParam(defaultValue = "24") int months,
            @RequestParam(required = false) Long propertyId) {
        try {
            Map<String, Object> trends = analyticsService.getTrendAnalysis(metric, months, propertyId);
            return ResponseEntity.ok(trends);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    /**
     * Export analytics data
     */
    @PostMapping("/export")
    public ResponseEntity<byte[]> exportAnalytics(@RequestBody Map<String, Object> exportConfig) {
        try {
            byte[] data = analyticsService.exportAnalytics(exportConfig);
            return ResponseEntity.ok()
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .header("Content-Disposition", "attachment; filename=analytics-report.xlsx")
                    .body(data);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}