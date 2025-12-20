package com.rentmaster.document;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "document_signatures")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DocumentSignature {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "document_id", nullable = false)
    private Long documentId;
    
    @Column(name = "signer_name", nullable = false)
    private String signerName;
    
    @Column(name = "signer_email", nullable = false)
    private String signerEmail;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "signer_role", nullable = false)
    private SignerRole signerRole;
    
    @Column(name = "signature_data", columnDefinition = "TEXT")
    private String signatureData;
    
    @Column(name = "signed_at")
    private LocalDateTime signedAt;
    
    @Column(name = "ip_address")
    private String ipAddress;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SignatureStatus status = SignatureStatus.PENDING;
    
    @Column(name = "signature_request_sent_at")
    private LocalDateTime signatureRequestSentAt;
    
    @Column(name = "expires_at")
    private LocalDateTime expiresAt;
    
    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    public enum SignerRole {
        TENANT,
        LANDLORD,
        WITNESS,
        ADMIN
    }
    
    public enum SignatureStatus {
        PENDING,
        SIGNED,
        REJECTED,
        EXPIRED
    }
    
    // Constructors
    public DocumentSignature() {
        this.createdAt = LocalDateTime.now();
    }
    
    public DocumentSignature(Long documentId, String signerName, String signerEmail, SignerRole signerRole) {
        this();
        this.documentId = documentId;
        this.signerName = signerName;
        this.signerEmail = signerEmail;
        this.signerRole = signerRole;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getDocumentId() {
        return documentId;
    }
    
    public void setDocumentId(Long documentId) {
        this.documentId = documentId;
    }
    
    public String getSignerName() {
        return signerName;
    }
    
    public void setSignerName(String signerName) {
        this.signerName = signerName;
    }
    
    public String getSignerEmail() {
        return signerEmail;
    }
    
    public void setSignerEmail(String signerEmail) {
        this.signerEmail = signerEmail;
    }
    
    public SignerRole getSignerRole() {
        return signerRole;
    }
    
    public void setSignerRole(SignerRole signerRole) {
        this.signerRole = signerRole;
    }
    
    public String getSignatureData() {
        return signatureData;
    }
    
    public void setSignatureData(String signatureData) {
        this.signatureData = signatureData;
    }
    
    public LocalDateTime getSignedAt() {
        return signedAt;
    }
    
    public void setSignedAt(LocalDateTime signedAt) {
        this.signedAt = signedAt;
    }
    
    public String getIpAddress() {
        return ipAddress;
    }
    
    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }
    
    public SignatureStatus getStatus() {
        return status;
    }
    
    public void setStatus(SignatureStatus status) {
        this.status = status;
    }
    
    public LocalDateTime getSignatureRequestSentAt() {
        return signatureRequestSentAt;
    }
    
    public void setSignatureRequestSentAt(LocalDateTime signatureRequestSentAt) {
        this.signatureRequestSentAt = signatureRequestSentAt;
    }
    
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
    
    public String getRejectionReason() {
        return rejectionReason;
    }
    
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}