package com.rentmaster.property;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "*")
public class FileController {

    @Value("${file.upload.local-directory:./uploads/properties/}")
    private String localDirectory;

    @GetMapping("/**")
    public ResponseEntity<Resource> getFile(HttpServletRequest request) {
        try {
            // Extract the path from the request URL
            String requestURI = request.getRequestURI();
            String path = requestURI.replace("/api/files/", "");
            
            if (path.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = Paths.get(localDirectory + path);
            File file = filePath.toFile();

            if (!file.exists() || !file.isFile()) {
                return ResponseEntity.notFound().build();
            }

            // Security check: ensure the file is within the upload directory
            Path uploadDir = Paths.get(localDirectory).toAbsolutePath().normalize();
            Path requestedFile = filePath.toAbsolutePath().normalize();
            if (!requestedFile.startsWith(uploadDir)) {
                return ResponseEntity.status(403).build();
            }

            Resource resource = new FileSystemResource(file);
            String contentType = Files.probeContentType(filePath);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}

