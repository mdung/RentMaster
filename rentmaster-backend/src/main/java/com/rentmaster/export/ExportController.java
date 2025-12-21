package com.rentmaster.export;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel(@RequestBody Map<String, Object> requestMap) throws IOException {
        ExportRequest request = convertToExportRequest(requestMap);
        byte[] data = exportService.exportToExcel(request);
        
        String filename = generateFilename(request.getEntity(), "xlsx");
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @PostMapping("/csv")
    public ResponseEntity<byte[]> exportToCsv(@RequestBody Map<String, Object> requestMap) {
        ExportRequest request = convertToExportRequest(requestMap);
        byte[] data = exportService.exportToCsv(request);
        
        String filename = generateFilename(request.getEntity(), "csv");
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportToPdf(@RequestBody Map<String, Object> requestMap) {
        ExportRequest request = convertToExportRequest(requestMap);
        byte[] data = exportService.exportToPdf(request);
        
        String filename = generateFilename(request.getEntity(), "pdf");
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(data);
    }

    @GetMapping("/columns/{entity}")
    public ResponseEntity<List<String>> getAvailableColumns(@PathVariable String entity) {
        List<String> columns = exportService.getAvailableColumns(entity);
        return ResponseEntity.ok(columns);
    }

    private String generateFilename(String entity, String extension) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        return entity.toLowerCase() + "_export_" + timestamp + "." + extension;
    }
    
    private ExportRequest convertToExportRequest(Map<String, Object> requestMap) {
        ExportRequest request = new ExportRequest();
        
        if (requestMap.get("type") != null) {
            request.setType(String.valueOf(requestMap.get("type")));
        }
        if (requestMap.get("entity") != null) {
            request.setEntity(String.valueOf(requestMap.get("entity")));
        }
        if (requestMap.get("filters") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> filters = (Map<String, Object>) requestMap.get("filters");
            request.setFilters(filters);
        }
        if (requestMap.get("columns") != null) {
            @SuppressWarnings("unchecked")
            List<String> columns = (List<String>) requestMap.get("columns");
            request.setColumns(columns);
        }
        if (requestMap.get("dateRange") != null) {
            @SuppressWarnings("unchecked")
            Map<String, Object> dateRangeMap = (Map<String, Object>) requestMap.get("dateRange");
            if (dateRangeMap != null && !dateRangeMap.isEmpty()) {
                ExportRequest.DateRange dateRange = new ExportRequest.DateRange();
                if (dateRangeMap.get("startDate") != null) {
                    String startDateStr = String.valueOf(dateRangeMap.get("startDate"));
                    if (!startDateStr.isEmpty() && !startDateStr.equals("null")) {
                        dateRange.setStartDate(LocalDate.parse(startDateStr));
                    }
                }
                if (dateRangeMap.get("endDate") != null) {
                    String endDateStr = String.valueOf(dateRangeMap.get("endDate"));
                    if (!endDateStr.isEmpty() && !endDateStr.equals("null")) {
                        dateRange.setEndDate(LocalDate.parse(endDateStr));
                    }
                }
                request.setDateRange(dateRange);
            }
        }
        
        return request;
    }
}