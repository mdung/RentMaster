package com.rentmaster.billing;

import com.rentmaster.billing.dto.InvoiceGenerateDTO;
import com.rentmaster.contract.BillingCycle;
import com.rentmaster.contract.Contract;
import com.rentmaster.contract.ContractRepository;
import com.rentmaster.contract.ContractStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Component
public class AutomatedInvoiceScheduler {

    private static final Logger log = LoggerFactory.getLogger(AutomatedInvoiceScheduler.class);

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private InvoiceService invoiceService;

    /**
     * Daily job that checks active contracts and generates invoices
     * according to their billing cycle when a new period starts.
     *
     * The cron below runs every day at 02:00 server time.
     */
    @Scheduled(cron = "0 0 2 * * *")
    @Transactional
    public void generateInvoicesForToday() {
        LocalDate today = LocalDate.now();
        log.info("Running automated invoice generation for date {}", today);
        generateInvoicesForDate(today);
    }

    /**
     * Exposed for manual triggering (via REST) and for the scheduled job.
     */
    @Transactional
    public void generateInvoicesForDate(LocalDate date) {
        List<Contract> activeContracts = contractRepository.findByStatus(ContractStatus.ACTIVE);

        for (Contract contract : activeContracts) {
            try {
                // Skip if contract not yet started or already ended
                if (date.isBefore(contract.getStartDate())) {
                    continue;
                }
                if (contract.getEndDate() != null && date.isAfter(contract.getEndDate())) {
                    continue;
                }

                BillingCycle cycle = contract.getBillingCycle();
                LocalDate periodStart;
                LocalDate periodEnd;

                if (cycle == BillingCycle.MONTHLY) {
                    YearMonth ym = YearMonth.from(date);
                    periodStart = ym.atDay(1);
                    periodEnd = ym.atEndOfMonth();
                } else if (cycle == BillingCycle.QUARTERLY) {
                    int quarter = (date.getMonthValue() - 1) / 3;
                    int startMonth = quarter * 3 + 1;
                    periodStart = LocalDate.of(date.getYear(), startMonth, 1);
                    periodEnd = periodStart.plusMonths(3).minusDays(1);
                } else { // YEARLY
                    periodStart = LocalDate.of(date.getYear(), 1, 1);
                    periodEnd = LocalDate.of(date.getYear(), 12, 31);
                }

                // Ensure the period intersects the contract dates
                if (periodEnd.isBefore(contract.getStartDate())) {
                    continue;
                }
                if (contract.getEndDate() != null && periodStart.isAfter(contract.getEndDate())) {
                    continue;
                }

                InvoiceGenerateDTO dto = new InvoiceGenerateDTO();
                dto.setContractId(contract.getId());
                dto.setPeriodStart(periodStart);
                dto.setPeriodEnd(periodEnd);
                dto.setIssueDate(date);
                // Due date: 7 days after issue date by default (same as manual)
                dto.setDueDate(date.plusDays(7));

                try {
                    invoiceService.generateInvoice(dto);
                    log.info("Generated invoice for contract {} for period {} - {}", contract.getCode(), periodStart, periodEnd);
                } catch (RuntimeException ex) {
                    // Most common case: invoice already exists for this period – log and continue
                    log.debug("Skipping invoice for contract {} and period {} - {}: {}",
                            contract.getCode(), periodStart, periodEnd, ex.getMessage());
                }
            } catch (Exception e) {
                log.error("Error while processing automated invoice for contract {}: {}",
                        contract.getCode(), e.getMessage(), e);
            }
        }
    }
}




