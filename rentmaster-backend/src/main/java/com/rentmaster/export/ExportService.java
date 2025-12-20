package com.rentmaster.export;

import com.rentmaster.billing.Invoice;
import com.rentmaster.billing.InvoiceRepository;
import com.rentmaster.billing.Payment;
import com.rentmaster.billing.PaymentRepository;
import com.rentmaster.contract.Contract;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.property.Property;
import com.rentmaster.property.PropertyRepository;
import com.rentmaster.tenant.Tenant;
import com.rentmaster.tenant.TenantRepository;
import com.rentmaster.user.User;
import com.rentmaster.user.UserRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class ExportService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private TenantRepository tenantRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    public byte[] exportToExcel(ExportRequest request) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet(request.getEntity());
            
            switch (request.getEntity().toUpperCase()) {
                case "INVOICES":
                    exportInvoicesToExcel(sheet, request);
                    break;
                case "PAYMENTS":
                    exportPaymentsToExcel(sheet, request);
                    break;
                case "CONTRACTS":
                    exportContractsToExcel(sheet, request);
                    break;
                case "TENANTS":
                    exportTenantsToExcel(sheet, request);
                    break;
                case "PROPERTIES":
                    exportPropertiesToExcel(sheet, request);
                    break;
                case "USERS":
                    exportUsersToExcel(sheet, request);
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported entity: " + request.getEntity());
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        }
    }

    public byte[] exportToCsv(ExportRequest request) {
        StringBuilder csv = new StringBuilder();
        
        switch (request.getEntity().toUpperCase()) {
            case "INVOICES":
                exportInvoicesToCsv(csv, request);
                break;
            case "PAYMENTS":
                exportPaymentsToCsv(csv, request);
                break;
            case "CONTRACTS":
                exportContractsToCsv(csv, request);
                break;
            case "TENANTS":
                exportTenantsToCsv(csv, request);
                break;
            case "PROPERTIES":
                exportPropertiesToCsv(csv, request);
                break;
            case "USERS":
                exportUsersToCsv(csv, request);
                break;
            default:
                throw new IllegalArgumentException("Unsupported entity: " + request.getEntity());
        }

        return csv.toString().getBytes();
    }

    public byte[] exportToPdf(ExportRequest request) {
        // TODO: Implement PDF export using iText or similar library
        // For now, return a simple message
        String message = "PDF export for " + request.getEntity() + " - Feature coming soon!";
        return message.getBytes();
    }

    public List<String> getAvailableColumns(String entity) {
        switch (entity.toUpperCase()) {
            case "INVOICES":
                return Arrays.asList("id", "contractCode", "tenantName", "roomCode", 
                    "periodStart", "periodEnd", "totalAmount", "paidAmount", "remainingAmount", "status");
            case "PAYMENTS":
                return Arrays.asList("id", "invoiceId", "amount", "paidAt", "method", "note");
            case "CONTRACTS":
                return Arrays.asList("id", "code", "roomCode", "primaryTenantName", 
                    "startDate", "endDate", "rentAmount", "status");
            case "TENANTS":
                return Arrays.asList("id", "fullName", "phone", "email", "idNumber", "address");
            case "PROPERTIES":
                return Arrays.asList("id", "name", "address", "description", "createdAt");
            case "USERS":
                return Arrays.asList("id", "username", "fullName", "email", "role", "active");
            default:
                return Arrays.asList();
        }
    }

    private void exportInvoicesToExcel(Sheet sheet, ExportRequest request) {
        List<Invoice> invoices = getFilteredInvoices(request);
        List<String> columns = request.getColumns() != null ? request.getColumns() : getAvailableColumns("INVOICES");

        // Create header row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columns.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(formatColumnName(columns.get(i)));
        }

        // Create data rows
        int rowNum = 1;
        for (Invoice invoice : invoices) {
            Row row = sheet.createRow(rowNum++);
            for (int i = 0; i < columns.size(); i++) {
                Cell cell = row.createCell(i);
                setInvoiceCellValue(cell, invoice, columns.get(i));
            }
        }

        // Auto-size columns
        for (int i = 0; i < columns.size(); i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void exportInvoicesToCsv(StringBuilder csv, ExportRequest request) {
        List<Invoice> invoices = getFilteredInvoices(request);
        List<String> columns = request.getColumns() != null ? request.getColumns() : getAvailableColumns("INVOICES");

        // Add header
        csv.append(String.join(",", columns.stream().map(this::formatColumnName).toArray(String[]::new))).append("\n");

        // Add data rows
        for (Invoice invoice : invoices) {
            String[] values = new String[columns.size()];
            for (int i = 0; i < columns.size(); i++) {
                values[i] = getInvoiceStringValue(invoice, columns.get(i));
            }
            csv.append(String.join(",", values)).append("\n");
        }
    }

    private void exportPaymentsToExcel(Sheet sheet, ExportRequest request) {
        List<Payment> payments = getFilteredPayments(request);
        List<String> columns = request.getColumns() != null ? request.getColumns() : getAvailableColumns("PAYMENTS");

        // Create header row
        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < columns.size(); i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(formatColumnName(columns.get(i)));
        }

        // Create data rows
        int rowNum = 1;
        for (Payment payment : payments) {
            Row row = sheet.createRow(rowNum++);
            for (int i = 0; i < columns.size(); i++) {
                Cell cell = row.createCell(i);
                setPaymentCellValue(cell, payment, columns.get(i));
            }
        }

        // Auto-size columns
        for (int i = 0; i < columns.size(); i++) {
            sheet.autoSizeColumn(i);
        }
    }

    private void exportPaymentsToCsv(StringBuilder csv, ExportRequest request) {
        List<Payment> payments = getFilteredPayments(request);
        List<String> columns = request.getColumns() != null ? request.getColumns() : getAvailableColumns("PAYMENTS");

        // Add header
        csv.append(String.join(",", columns.stream().map(this::formatColumnName).toArray(String[]::new))).append("\n");

        // Add data rows
        for (Payment payment : payments) {
            String[] values = new String[columns.size()];
            for (int i = 0; i < columns.size(); i++) {
                values[i] = getPaymentStringValue(payment, columns.get(i));
            }
            csv.append(String.join(",", values)).append("\n");
        }
    }

    // Similar methods for other entities...
    private void exportContractsToExcel(Sheet sheet, ExportRequest request) {
        // TODO: Implement contract export
    }

    private void exportContractsToCsv(StringBuilder csv, ExportRequest request) {
        // TODO: Implement contract export
    }

    private void exportTenantsToExcel(Sheet sheet, ExportRequest request) {
        // TODO: Implement tenant export
    }

    private void exportTenantsToCsv(StringBuilder csv, ExportRequest request) {
        // TODO: Implement tenant export
    }

    private void exportPropertiesToExcel(Sheet sheet, ExportRequest request) {
        // TODO: Implement property export
    }

    private void exportPropertiesToCsv(StringBuilder csv, ExportRequest request) {
        // TODO: Implement property export
    }

    private void exportUsersToExcel(Sheet sheet, ExportRequest request) {
        // TODO: Implement user export
    }

    private void exportUsersToCsv(StringBuilder csv, ExportRequest request) {
        // TODO: Implement user export
    }

    private List<Invoice> getFilteredInvoices(ExportRequest request) {
        // TODO: Apply filters and date range
        return invoiceRepository.findAll();
    }

    private List<Payment> getFilteredPayments(ExportRequest request) {
        // TODO: Apply filters and date range
        return paymentRepository.findAll();
    }

    private void setInvoiceCellValue(Cell cell, Invoice invoice, String column) {
        switch (column) {
            case "id":
                cell.setCellValue(invoice.getId());
                break;
            case "contractCode":
                cell.setCellValue(invoice.getContract().getCode());
                break;
            case "tenantName":
                cell.setCellValue(invoice.getContract().getPrimaryTenant().getFullName());
                break;
            case "totalAmount":
                cell.setCellValue(invoice.getTotalAmount().doubleValue());
                break;
            case "paidAmount":
                cell.setCellValue(invoice.getPaidAmount().doubleValue());
                break;
            case "remainingAmount":
                cell.setCellValue(invoice.getRemainingAmount().doubleValue());
                break;
            case "status":
                cell.setCellValue(invoice.getStatus().name());
                break;
            default:
                cell.setCellValue("");
        }
    }

    private String getInvoiceStringValue(Invoice invoice, String column) {
        switch (column) {
            case "id":
                return String.valueOf(invoice.getId());
            case "contractCode":
                return invoice.getContract().getCode();
            case "tenantName":
                return invoice.getContract().getPrimaryTenant().getFullName();
            case "totalAmount":
                return String.valueOf(invoice.getTotalAmount());
            case "paidAmount":
                return String.valueOf(invoice.getPaidAmount());
            case "remainingAmount":
                return String.valueOf(invoice.getRemainingAmount());
            case "status":
                return invoice.getStatus().name();
            default:
                return "";
        }
    }

    private void setPaymentCellValue(Cell cell, Payment payment, String column) {
        switch (column) {
            case "id":
                cell.setCellValue(payment.getId());
                break;
            case "invoiceId":
                cell.setCellValue(payment.getInvoice().getId());
                break;
            case "amount":
                cell.setCellValue(payment.getAmount().doubleValue());
                break;
            case "method":
                cell.setCellValue(payment.getMethod() != null ? payment.getMethod() : "");
                break;
            case "note":
                cell.setCellValue(payment.getNote() != null ? payment.getNote() : "");
                break;
            default:
                cell.setCellValue("");
        }
    }

    private String getPaymentStringValue(Payment payment, String column) {
        switch (column) {
            case "id":
                return String.valueOf(payment.getId());
            case "invoiceId":
                return String.valueOf(payment.getInvoice().getId());
            case "amount":
                return String.valueOf(payment.getAmount());
            case "method":
                return payment.getMethod() != null ? payment.getMethod() : "";
            case "note":
                return payment.getNote() != null ? payment.getNote() : "";
            default:
                return "";
        }
    }

    private String formatColumnName(String column) {
        return column.replaceAll("([A-Z])", " $1").trim();
    }
}