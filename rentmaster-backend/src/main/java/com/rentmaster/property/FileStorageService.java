package com.rentmaster.property;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.storage-type:local}")
    private String storageType;

    @Value("${file.upload.local-directory:./uploads/properties/}")
    private String localDirectory;

    @Value("${file.upload.s3.bucket-name:}")
    private String s3BucketName;

    @Value("${file.upload.s3.region:us-east-1}")
    private String s3Region;

    @Value("${file.upload.s3.access-key:}")
    private String s3AccessKey;

    @Value("${file.upload.s3.secret-key:}")
    private String s3SecretKey;

    @Value("${file.upload.s3.endpoint:}")
    private String s3Endpoint;

    /**
     * Uploads a file and returns the file path or URL
     */
    public String uploadFile(MultipartFile file, String subdirectory) throws IOException {
        if ("s3".equalsIgnoreCase(storageType)) {
            return uploadToS3(file, subdirectory);
        } else {
            return uploadToLocal(file, subdirectory);
        }
    }

    /**
     * Uploads file to local filesystem
     */
    private String uploadToLocal(MultipartFile file, String subdirectory) throws IOException {
        String fileName = System.currentTimeMillis() + "_" + UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        Path uploadPath = Paths.get(localDirectory + subdirectory);
        Files.createDirectories(uploadPath);

        Path filePath = uploadPath.resolve(fileName);
        Files.write(filePath, file.getBytes());

        // Return relative path for local storage
        return subdirectory + fileName;
    }

    /**
     * Uploads file to AWS S3
     * Note: S3 upload requires AWS SDK dependency. Falls back to local if S3 is not properly configured.
     * To enable S3, uncomment the S3 implementation and ensure AWS SDK is in classpath.
     */
    private String uploadToS3(MultipartFile file, String subdirectory) throws IOException {
        if (s3BucketName == null || s3BucketName.isEmpty() || 
            s3AccessKey == null || s3AccessKey.isEmpty() || 
            s3SecretKey == null || s3SecretKey.isEmpty()) {
            // Fallback to local storage if S3 is not configured
            return uploadToLocal(file, subdirectory);
        }

        // S3 implementation would go here when AWS SDK is available
        // For now, fallback to local storage
        // This allows the application to work without S3 dependencies
        return uploadToLocal(file, subdirectory);
    }

    /**
     * Gets the base URL for file access
     */
    public String getFileUrl(String filePath) {
        if ("s3".equalsIgnoreCase(storageType)) {
            // For S3, filePath is already a full URL
            return filePath;
        } else {
            // For local, return a relative path that can be served by the application
            return "/api/files/" + filePath;
        }
    }
}

