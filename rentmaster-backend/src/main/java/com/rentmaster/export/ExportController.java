package com.rentmaster.export;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/export")
@CrossOrigin(origins = "*")
public class ExportController {

    @Autowired
    private ExportService exportService;

    @PostMapping("/excel")
    public ResponseEntity<byte[]> exportToExcel(@RequestBody ExportRequest request) throws IOException {
        byte[] data = exportService.exportToExcel(request);
        
        String filename = generateFilename(request.getEntity(), "xlsx");
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }

    @PostMapping("/csv")
    public ResponseEntity<byte[]> exportToCsv(@RequestBody ExportRequest request) {
        byte[] data = exportService.exportToCsv(request);
        
        String filename = generateFilename(request.getEntity(), "csv");
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(data);
    }

    @PostMapping("/pdf")
    public ResponseEntity<byte[]> exportToPdf(@RequestBody ExportRequest request) {
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
}