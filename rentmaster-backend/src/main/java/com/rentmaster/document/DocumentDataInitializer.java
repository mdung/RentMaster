package com.rentmaster.document;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class DocumentDataInitializer implements CommandLineRunner {
    
    private static final Logger log = LoggerFactory.getLogger(DocumentDataInitializer.class);
    
    @Autowired
    private DocumentRepository documentRepository;
    
    @Autowired
    private DocumentTemplateRepository templateRepository;
    
    @Autowired
    private DocumentSignatureRepository signatureRepository;
    
    @Autowired
    private DocumentVersionRepository versionRepository;
    
    @Autowired
    private BulkDocumentGenerationRepository bulkGenerationRepository;
    
    @Autowired
    private DocumentFolderRepository folderRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (folderRepository.count() == 0) {
            initializeFolders();
        }
        
        if (templateRepository.count() == 0) {
            initializeTemplates();
        }
        
        if (documentRepository.count() == 0) {
            initializeDocuments();
        }
        
        if (signatureRepository.count() == 0) {
            initializeSignatures();
        }
        
        if (versionRepository.count() == 0) {
            initializeVersions();
        }
        
        if (bulkGenerationRepository.count() == 0) {
            initializeBulkGenerations();
        }
        
        log.info("Document management data initialization completed");
    }
    
    private void initializeFolders() {
        List<DocumentFolder> folders = Arrays.asList(
            createFolder("Contracts", "/Contracts/", "All rental contracts and lease agreements", false),
            createFolder("Tenant Documents", "/Tenant Documents/", "Documents related to tenants", false),
            createFolder("Property Documents", "/Property Documents/", "Property-related documentation", false),
            createFolder("Financial Records", "/Financial Records/", "Invoices, receipts, and financial documents", false),
            createFolder("Legal Documents", "/Legal Documents/", "Legal notices and compliance documents", false),
            createFolder("Maintenance Records", "/Maintenance Records/", "Maintenance reports and work orders", false),
            createFolder("Insurance", "/Insurance/", "Insurance policies and claims", false),
            createFolder("Templates", "/Templates/", "Document templates for reuse", true)
        );
        
        folderRepository.saveAll(folders);
        log.info("Initialized {} document folders", folders.size());
    }
    
    private void initializeTemplates() {
        List<DocumentTemplate> templates = Arrays.asList(
            createTemplate(
                "Standard Lease Agreement",
                DocumentTemplate.TemplateType.LEASE_AGREEMENT,
                "RESIDENTIAL LEASE AGREEMENT\n\n" +
                "This Lease Agreement is entered into on {{lease_start_date}} between {{landlord_name}} (Landlord) and {{tenant_name}} (Tenant).\n\n" +
                "PROPERTY: {{property_address}}\n" +
                "RENT: ${{monthly_rent}} per month\n" +
                "LEASE TERM: {{lease_duration}} months\n" +
                "SECURITY DEPOSIT: ${{security_deposit}}\n\n" +
                "TERMS AND CONDITIONS:\n" +
                "1. Rent is due on the {{rent_due_date}} of each month\n" +
                "2. Late fees of ${{late_fee}} apply after {{grace_period}} days\n" +
                "3. No pets allowed without written consent\n" +
                "4. Tenant is responsible for utilities: {{utilities_responsibility}}\n" +
                "5. Property must be maintained in good condition\n\n" +
                "Landlord: {{landlord_name}}\n" +
                "Date: {{signature_date}}\n\n" +
                "Tenant: {{tenant_name}}\n" +
                "Date: {{signature_date}}",
                "Legal",
                "Standard residential lease agreement template",
                true
            ),
            
            createTemplate(
                "Monthly Rent Invoice",
                DocumentTemplate.TemplateType.INVOICE,
                "RENT INVOICE\n\n" +
                "Invoice #: {{invoice_number}}\n" +
                "Date: {{invoice_date}}\n" +
                "Due Date: {{due_date}}\n\n" +
                "Bill To:\n" +
                "{{tenant_name}}\n" +
                "{{property_address}}\n\n" +
                "From:\n" +
                "{{landlord_name}}\n" +
                "{{company_name}}\n" +
                "{{landlord_address}}\n" +
                "{{landlord_phone}}\n" +
                "{{landlord_email}}\n\n" +
                "DESCRIPTION:\n" +
                "Monthly Rent - {{rental_period}}: ${{monthly_rent}}\n" +
                "{{additional_charges}}\n\n" +
                "TOTAL AMOUNT DUE: ${{total_amount}}\n\n" +
                "Payment Instructions:\n" +
                "{{payment_instructions}}\n\n" +
                "Thank you for your prompt payment!",
                "Financial",
                "Monthly rent invoice template",
                true
            ),
            
            createTemplate(
                "Lease Renewal Notice",
                DocumentTemplate.TemplateType.NOTICE,
                "LEASE RENEWAL NOTICE\n\n" +
                "Date: {{notice_date}}\n\n" +
                "Dear {{tenant_name}},\n\n" +
                "This notice is to inform you that your current lease for the property at {{property_address}} " +
                "is set to expire on {{lease_end_date}}.\n\n" +
                "We would like to offer you the opportunity to renew your lease under the following terms:\n\n" +
                "New Lease Term: {{new_lease_duration}} months\n" +
                "New Monthly Rent: ${{new_monthly_rent}}\n" +
                "Lease Start Date: {{new_lease_start_date}}\n" +
                "Lease End Date: {{new_lease_end_date}}\n\n" +
                "Please respond by {{response_deadline}} to confirm your intention to renew.\n\n" +
                "If you have any questions, please contact us at {{contact_phone}} or {{contact_email}}.\n\n" +
                "Sincerely,\n" +
                "{{landlord_name}}\n" +
                "{{company_name}}",
                "Legal",
                "Lease renewal notice template",
                false
            ),
            
            createTemplate(
                "Maintenance Work Order",
                DocumentTemplate.TemplateType.REPORT,
                "MAINTENANCE WORK ORDER\n\n" +
                "Work Order #: {{work_order_number}}\n" +
                "Date Created: {{creation_date}}\n" +
                "Priority: {{priority_level}}\n\n" +
                "Property Information:\n" +
                "Address: {{property_address}}\n" +
                "Unit: {{unit_number}}\n" +
                "Tenant: {{tenant_name}}\n" +
                "Phone: {{tenant_phone}}\n\n" +
                "Issue Description:\n" +
                "{{issue_description}}\n\n" +
                "Requested Service:\n" +
                "{{requested_service}}\n\n" +
                "Assigned To: {{assigned_technician}}\n" +
                "Scheduled Date: {{scheduled_date}}\n" +
                "Estimated Cost: ${{estimated_cost}}\n\n" +
                "Special Instructions:\n" +
                "{{special_instructions}}\n\n" +
                "Tenant Signature: ___________________ Date: ___________\n" +
                "Technician Signature: _______________ Date: ___________",
                "Maintenance",
                "Standard maintenance work order template",
                true
            ),
            
            createTemplate(
                "Payment Receipt",
                DocumentTemplate.TemplateType.RECEIPT,
                "PAYMENT RECEIPT\n\n" +
                "Receipt #: {{receipt_number}}\n" +
                "Date: {{payment_date}}\n\n" +
                "Received From:\n" +
                "{{tenant_name}}\n" +
                "{{property_address}}\n\n" +
                "Payment Details:\n" +
                "Amount: ${{payment_amount}}\n" +
                "Payment Method: {{payment_method}}\n" +
                "Reference: {{payment_reference}}\n\n" +
                "For:\n" +
                "{{payment_description}}\n" +
                "Period: {{payment_period}}\n\n" +
                "Balance Information:\n" +
                "Previous Balance: ${{previous_balance}}\n" +
                "Payment Applied: ${{payment_amount}}\n" +
                "New Balance: ${{new_balance}}\n\n" +
                "Thank you for your payment!\n\n" +
                "{{company_name}}\n" +
                "{{landlord_name}}\n" +
                "{{contact_information}}",
                "Financial",
                "Payment receipt template",
                true
            ),
            
            createTemplate(
                "Move-Out Inspection Report",
                DocumentTemplate.TemplateType.REPORT,
                "MOVE-OUT INSPECTION REPORT\n\n" +
                "Property: {{property_address}}\n" +
                "Unit: {{unit_number}}\n" +
                "Tenant: {{tenant_name}}\n" +
                "Inspection Date: {{inspection_date}}\n" +
                "Inspector: {{inspector_name}}\n\n" +
                "ROOM-BY-ROOM INSPECTION:\n\n" +
                "Living Room:\n" +
                "Walls: {{living_room_walls}}\n" +
                "Flooring: {{living_room_flooring}}\n" +
                "Windows: {{living_room_windows}}\n" +
                "Condition: {{living_room_condition}}\n\n" +
                "Kitchen:\n" +
                "Appliances: {{kitchen_appliances}}\n" +
                "Cabinets: {{kitchen_cabinets}}\n" +
                "Countertops: {{kitchen_countertops}}\n" +
                "Condition: {{kitchen_condition}}\n\n" +
                "Bathroom:\n" +
                "Fixtures: {{bathroom_fixtures}}\n" +
                "Tiles: {{bathroom_tiles}}\n" +
                "Condition: {{bathroom_condition}}\n\n" +
                "SECURITY DEPOSIT DEDUCTIONS:\n" +
                "{{deduction_details}}\n\n" +
                "Total Deductions: ${{total_deductions}}\n" +
                "Security Deposit Refund: ${{refund_amount}}\n\n" +
                "Tenant Signature: ___________________ Date: ___________\n" +
                "Landlord Signature: _________________ Date: ___________",
                "Legal",
                "Move-out inspection report template",
                false
            )
        );
        
        templateRepository.saveAll(templates);
        log.info("Initialized {} document templates", templates.size());
    }
    
    private void initializeDocuments() {
        List<Document> documents = Arrays.asList(
            createDocument(
                "John Doe - Lease Agreement 2024",
                "lease_agreement_john_doe_2024.pdf",
                "/uploads/documents/lease_agreement_john_doe_2024.pdf",
                245760L,
                "application/pdf",
                Document.DocumentType.LEASE_AGREEMENT,
                Document.DocumentCategory.LEGAL_DOCUMENTS,
                1L, // tenantId
                1L, // propertyId
                1L, // contractId
                "Signed lease agreement for John Doe at 123 Main Street",
                Arrays.asList("lease", "2024", "signed"),
                false,
                true,
                Document.SignatureStatus.SIGNED,
                LocalDateTime.now().plusYears(1),
                1L // folderId (Contracts)
            ),
            
            createDocument(
                "Jane Smith - ID Copy",
                "jane_smith_drivers_license.jpg",
                "/uploads/documents/jane_smith_drivers_license.jpg",
                1024000L,
                "image/jpeg",
                Document.DocumentType.ID_DOCUMENT,
                Document.DocumentCategory.TENANT_DOCUMENTS,
                2L, // tenantId
                null,
                null,
                "Copy of Jane Smith's driver's license for tenant verification",
                Arrays.asList("id", "verification", "jane_smith"),
                false,
                false,
                Document.SignatureStatus.NOT_REQUIRED,
                null,
                2L // folderId (Tenant Documents)
            ),
            
            createDocument(
                "March 2024 Rent Receipt - Mike Johnson",
                "rent_receipt_mike_johnson_march_2024.pdf",
                "/uploads/documents/rent_receipt_mike_johnson_march_2024.pdf",
                89600L,
                "application/pdf",
                Document.DocumentType.RECEIPT,
                Document.DocumentCategory.FINANCIAL_DOCUMENTS,
                3L, // tenantId
                2L, // propertyId
                null,
                "Rent payment receipt for Mike Johnson - March 2024",
                Arrays.asList("receipt", "march", "2024", "rent"),
                false,
                false,
                Document.SignatureStatus.NOT_REQUIRED,
                null,
                4L // folderId (Financial Records)
            ),
            
            createDocument(
                "Property Insurance Policy - Building A",
                "property_insurance_building_a_2024.pdf",
                "/uploads/documents/property_insurance_building_a_2024.pdf",
                512000L,
                "application/pdf",
                Document.DocumentType.INSURANCE,
                Document.DocumentCategory.PROPERTY_DOCUMENTS,
                null,
                1L, // propertyId
                null,
                "Annual property insurance policy for Building A",
                Arrays.asList("insurance", "property", "building_a", "2024"),
                true,
                false,
                Document.SignatureStatus.NOT_REQUIRED,
                LocalDateTime.now().plusYears(1),
                7L // folderId (Insurance)
            ),
            
            createDocument(
                "Maintenance Report - Plumbing Repair",
                "maintenance_report_plumbing_unit_4b.pdf",
                "/uploads/documents/maintenance_report_plumbing_unit_4b.pdf",
                156800L,
                "application/pdf",
                Document.DocumentType.MAINTENANCE_REPORT,
                Document.DocumentCategory.MAINTENANCE_DOCUMENTS,
                4L, // tenantId
                1L, // propertyId
                null,
                "Plumbing repair work completed in Unit 4B",
                Arrays.asList("maintenance", "plumbing", "repair", "unit_4b"),
                false,
                true,
                Document.SignatureStatus.PENDING,
                null,
                6L // folderId (Maintenance Records)
            ),
            
            createDocument(
                "Sarah Wilson - Contract Renewal",
                "contract_renewal_sarah_wilson_2024.pdf",
                "/uploads/documents/contract_renewal_sarah_wilson_2024.pdf",
                198400L,
                "application/pdf",
                Document.DocumentType.CONTRACT,
                Document.DocumentCategory.LEGAL_DOCUMENTS,
                5L, // tenantId
                3L, // propertyId
                2L, // contractId
                "Contract renewal agreement for Sarah Wilson",
                Arrays.asList("renewal", "contract", "sarah_wilson", "2024"),
                false,
                true,
                Document.SignatureStatus.PENDING,
                LocalDateTime.now().plusMonths(6),
                1L // folderId (Contracts)
            ),
            
            createDocument(
                "Monthly Invoice Template - March 2024",
                "monthly_invoice_template_march_2024.docx",
                "/uploads/documents/monthly_invoice_template_march_2024.docx",
                45600L,
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                Document.DocumentType.INVOICE,
                Document.DocumentCategory.FINANCIAL_DOCUMENTS,
                null,
                null,
                null,
                "Template for monthly rent invoices",
                Arrays.asList("template", "invoice", "monthly"),
                true,
                false,
                Document.SignatureStatus.NOT_REQUIRED,
                null,
                8L // folderId (Templates)
            ),
            
            createDocument(
                "David Brown - Lease Application",
                "lease_application_david_brown.pdf",
                "/uploads/documents/lease_application_david_brown.pdf",
                234500L,
                "application/pdf",
                Document.DocumentType.CONTRACT,
                Document.DocumentCategory.TENANT_DOCUMENTS,
                6L, // tenantId
                null,
                null,
                "Completed lease application from David Brown",
                Arrays.asList("application", "lease", "david_brown"),
                false,
                true,
                Document.SignatureStatus.SIGNED,
                null,
                2L // folderId (Tenant Documents)
            )
        );
        
        documentRepository.saveAll(documents);
        log.info("Initialized {} documents", documents.size());
    }
    
    private void initializeSignatures() {
        List<DocumentSignature> signatures = Arrays.asList(
            createSignature(1L, "John Doe", "john.doe@email.com", DocumentSignature.SignerRole.TENANT, 
                          DocumentSignature.SignatureStatus.SIGNED, LocalDateTime.now().minusDays(5)),
            
            createSignature(1L, "Robert Smith", "robert.smith@realty.com", DocumentSignature.SignerRole.LANDLORD, 
                          DocumentSignature.SignatureStatus.SIGNED, LocalDateTime.now().minusDays(5)),
            
            createSignature(5L, "Mike Johnson", "mike.johnson@email.com", DocumentSignature.SignerRole.TENANT, 
                          DocumentSignature.SignatureStatus.PENDING, null),
            
            createSignature(5L, "Property Manager", "manager@realty.com", DocumentSignature.SignerRole.ADMIN, 
                          DocumentSignature.SignatureStatus.PENDING, null),
            
            createSignature(6L, "Sarah Wilson", "sarah.wilson@email.com", DocumentSignature.SignerRole.TENANT, 
                          DocumentSignature.SignatureStatus.PENDING, null),
            
            createSignature(8L, "David Brown", "david.brown@email.com", DocumentSignature.SignerRole.TENANT, 
                          DocumentSignature.SignatureStatus.SIGNED, LocalDateTime.now().minusDays(2))
        );
        
        signatureRepository.saveAll(signatures);
        log.info("Initialized {} document signatures", signatures.size());
    }
    
    private void initializeVersions() {
        List<DocumentVersion> versions = Arrays.asList(
            createVersion(1L, 1, "lease_agreement_john_doe_2024.pdf", 
                        "/uploads/documents/lease_agreement_john_doe_2024.pdf", 245760L, "Initial version"),
            
            createVersion(3L, 1, "rent_receipt_mike_johnson_march_2024.pdf", 
                        "/uploads/documents/rent_receipt_mike_johnson_march_2024.pdf", 89600L, "Initial version"),
            
            createVersion(5L, 1, "maintenance_report_plumbing_unit_4b.pdf", 
                        "/uploads/documents/maintenance_report_plumbing_unit_4b.pdf", 156800L, "Initial version"),
            
            createVersion(5L, 2, "maintenance_report_plumbing_unit_4b_v2.pdf", 
                        "/uploads/documents/maintenance_report_plumbing_unit_4b_v2.pdf", 162400L, "Added cost breakdown and photos"),
            
            createVersion(6L, 1, "contract_renewal_sarah_wilson_2024.pdf", 
                        "/uploads/documents/contract_renewal_sarah_wilson_2024.pdf", 198400L, "Initial version"),
            
            createVersion(7L, 1, "monthly_invoice_template_march_2024.docx", 
                        "/uploads/documents/monthly_invoice_template_march_2024.docx", 45600L, "Initial version"),
            
            createVersion(7L, 2, "monthly_invoice_template_march_2024_v2.docx", 
                        "/uploads/documents/monthly_invoice_template_march_2024_v2.docx", 47200L, "Updated formatting and added late fee section")
        );
        
        versionRepository.saveAll(versions);
        log.info("Initialized {} document versions", versions.size());
    }
    
    private void initializeBulkGenerations() {
        List<BulkDocumentGeneration> bulkGenerations = Arrays.asList(
            createBulkGeneration(
                "Monthly Rent Invoices - March 2024",
                2L, // Monthly Rent Invoice template
                "Monthly Rent Invoice",
                BulkDocumentGeneration.RecipientType.ACTIVE_TENANTS,
                Arrays.asList(1L, 2L, 3L, 4L, 5L),
                Map.of("invoice_date", "2024-03-01", "due_date", "2024-03-15", "rental_period", "March 2024"),
                BulkDocumentGeneration.OutputFormat.PDF,
                BulkDocumentGeneration.GenerationStatus.COMPLETED,
                LocalDateTime.now().minusDays(10)
            ),
            
            createBulkGeneration(
                "Lease Renewal Notices - Q2 2024",
                3L, // Lease Renewal Notice template
                "Lease Renewal Notice",
                BulkDocumentGeneration.RecipientType.EXPIRING_CONTRACTS,
                Arrays.asList(2L, 5L),
                Map.of("notice_date", "2024-03-15", "response_deadline", "2024-04-15", "new_lease_duration", "12"),
                BulkDocumentGeneration.OutputFormat.PDF,
                BulkDocumentGeneration.GenerationStatus.COMPLETED,
                LocalDateTime.now().minusDays(5)
            ),
            
            createBulkGeneration(
                "Annual Insurance Documents",
                6L, // Custom template for insurance
                "Insurance Document Template",
                BulkDocumentGeneration.RecipientType.PROPERTIES,
                Arrays.asList(1L, 2L, 3L),
                Map.of("policy_year", "2024", "effective_date", "2024-01-01", "expiry_date", "2024-12-31"),
                BulkDocumentGeneration.OutputFormat.PDF,
                BulkDocumentGeneration.GenerationStatus.DRAFT,
                LocalDateTime.now().minusDays(1)
            ),
            
            createBulkGeneration(
                "Maintenance Work Orders - Weekly Batch",
                4L, // Maintenance Work Order template
                "Maintenance Work Order",
                BulkDocumentGeneration.RecipientType.SPECIFIC_TENANTS,
                Arrays.asList(3L, 4L, 6L),
                Map.of("creation_date", "2024-03-18", "priority_level", "Medium", "scheduled_date", "2024-03-25"),
                BulkDocumentGeneration.OutputFormat.PDF,
                BulkDocumentGeneration.GenerationStatus.GENERATING,
                LocalDateTime.now().minusHours(2)
            )
        );
        
        bulkGenerationRepository.saveAll(bulkGenerations);
        log.info("Initialized {} bulk document generations", bulkGenerations.size());
    }
    
    // Helper methods
    private DocumentFolder createFolder(String name, String path, String description, boolean isSystem) {
        DocumentFolder folder = new DocumentFolder(name, path, 1L); // createdBy = 1 (Admin)
        folder.setDescription(description);
        folder.setIsSystem(isSystem);
        folder.setDocumentCount(0);
        folder.setSubfolderCount(0);
        return folder;
    }
    
    private DocumentTemplate createTemplate(String name, DocumentTemplate.TemplateType templateType, String content,
                                          String category, String description, boolean isDefault) {
        DocumentTemplate template = new DocumentTemplate(name, templateType, content, category, 1L, "Admin User");
        template.setDescription(description);
        template.setIsDefault(isDefault);
        template.setActive(true);
        
        // Extract variables from content
        List<String> variables = new ArrayList<>();
        String[] words = content.split("\\{\\{|\\}\\}");
        for (int i = 1; i < words.length; i += 2) {
            String variable = words[i].trim();
            if (!variables.contains(variable)) {
                variables.add(variable);
            }
        }
        template.setVariables(variables);
        
        return template;
    }
    
    private Document createDocument(String name, String originalFileName, String filePath, Long fileSize, String mimeType,
                                  Document.DocumentType documentType, Document.DocumentCategory category,
                                  Long tenantId, Long propertyId, Long contractId, String description,
                                  List<String> tags, boolean isPublic, boolean requiresSignature,
                                  Document.SignatureStatus signatureStatus, LocalDateTime expiryDate, Long folderId) {
        
        Document document = new Document(name, originalFileName, filePath, fileSize, mimeType, documentType, category, 1L, "Admin User");
        document.setTenantId(tenantId);
        document.setPropertyId(propertyId);
        document.setContractId(contractId);
        document.setDescription(description);
        document.setTags(tags);
        document.setIsPublic(isPublic);
        document.setRequiresSignature(requiresSignature);
        document.setSignatureStatus(signatureStatus);
        document.setExpiryDate(expiryDate);
        document.setFolderId(folderId);
        document.setVersion(1);
        
        return document;
    }
    
    private DocumentSignature createSignature(Long documentId, String signerName, String signerEmail,
                                            DocumentSignature.SignerRole signerRole, DocumentSignature.SignatureStatus status,
                                            LocalDateTime signedAt) {
        
        DocumentSignature signature = new DocumentSignature(documentId, signerName, signerEmail, signerRole);
        signature.setStatus(status);
        signature.setSignedAt(signedAt);
        signature.setSignatureRequestSentAt(LocalDateTime.now().minusDays(7));
        signature.setExpiresAt(LocalDateTime.now().plusDays(30));
        
        if (status == DocumentSignature.SignatureStatus.SIGNED) {
            signature.setSignatureData("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==");
            signature.setIpAddress("192.168.1.100");
        }
        
        return signature;
    }
    
    private DocumentVersion createVersion(Long documentId, Integer version, String fileName, String filePath,
                                        Long fileSize, String changeDescription) {
        
        DocumentVersion docVersion = new DocumentVersion(documentId, version, fileName, filePath, fileSize, 1L, "Admin User");
        docVersion.setChangeDescription(changeDescription);
        
        return docVersion;
    }
    
    private BulkDocumentGeneration createBulkGeneration(String name, Long templateId, String templateName,
                                                      BulkDocumentGeneration.RecipientType recipientType,
                                                      List<Long> recipientIds, Map<String, String> variables,
                                                      BulkDocumentGeneration.OutputFormat outputFormat,
                                                      BulkDocumentGeneration.GenerationStatus status,
                                                      LocalDateTime createdAt) {
        
        BulkDocumentGeneration bulk = new BulkDocumentGeneration(name, templateId, templateName, recipientType, 1L, "Admin User");
        bulk.setRecipientIds(recipientIds);
        bulk.setVariables(variables);
        bulk.setOutputFormat(outputFormat);
        bulk.setStatus(status);
        bulk.setTotalDocuments(recipientIds.size());
        bulk.setCreatedAt(createdAt);
        
        if (status == BulkDocumentGeneration.GenerationStatus.COMPLETED) {
            bulk.setGeneratedCount(recipientIds.size());
            bulk.setFailedCount(0);
            bulk.setCompletedAt(createdAt.plusMinutes(5));
        } else if (status == BulkDocumentGeneration.GenerationStatus.GENERATING) {
            bulk.setGeneratedCount(recipientIds.size() / 2);
            bulk.setFailedCount(0);
        }
        
        return bulk;
    }
}