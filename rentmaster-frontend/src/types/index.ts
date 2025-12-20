export interface User {
  id?: number;
  username: string;
  role: string;
  fullName: string;
  email?: string;
  active?: boolean;
  createdAt?: string;
}

export interface Property {
  id: number;
  name: string;
  address?: string;
  description?: string;
  createdAt: string;
}

export interface Room {
  id: number;
  propertyId: number;
  propertyName: string;
  code: string;
  floor?: string;
  type?: string;
  sizeM2?: number;
  status: string;
  baseRent: number;
  capacity?: number;
  notes?: string;
}

export interface Tenant {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  idNumber?: string;
  address?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface Contract {
  id: number;
  code: string;
  roomId: number;
  roomCode: string;
  propertyName: string;
  primaryTenantId: number;
  primaryTenantName: string;
  tenantIds: number[];
  startDate: string;
  endDate?: string;
  rentAmount: number;
  depositAmount?: number;
  billingCycle: string;
  status: string;
  createdAt: string;
}

export interface Invoice {
  id: number;
  contractId: number;
  contractCode: string;
  tenantName: string;
  roomCode: string;
  periodStart: string;
  periodEnd: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: string;
  createdAt: string;
  items: InvoiceItem[];
  payments: Payment[];
}

export interface InvoiceItem {
  id: number;
  serviceId?: number;
  serviceName?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  prevIndex?: number;
  currentIndex?: number;
}

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  paidAt: string;
  method?: string;
  note?: string;
}

export interface Service {
  id: number;
  name: string;
  type: string;
  pricingModel: string;
  unitPrice?: number;
  unitName?: string;
  active: boolean;
}

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  activeContracts: number;
  totalOutstanding: number;
  monthlyRevenue: number;
  totalTenants: number;
  newTenantsThisMonth: number;
  averageRent: number;
  collectionRate: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  date?: string;
  percentage?: number;
}

export interface RevenueData {
  monthly: ChartDataPoint[];
  yearly: ChartDataPoint[];
  comparison: {
    currentMonth: number;
    previousMonth: number;
    growth: number;
  };
}

export interface OccupancyData {
  monthly: ChartDataPoint[];
  byPropertyType: ChartDataPoint[];
  trends: {
    currentRate: number;
    previousRate: number;
    change: number;
  };
}

export interface PaymentMethodData {
  methods: ChartDataPoint[];
  trends: ChartDataPoint[];
}

export interface ActivityItem {
  id: number;
  type: 'PAYMENT' | 'TENANT' | 'CONTRACT' | 'MAINTENANCE' | 'INVOICE' | 'SYSTEM';
  title: string;
  description: string;
  timestamp: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  icon: string;
  color: string;
}

export interface UpcomingDueDate {
  id: number;
  type: 'INVOICE' | 'CONTRACT' | 'MAINTENANCE' | 'INSPECTION';
  title: string;
  description: string;
  dueDate: string;
  amount?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'UPCOMING' | 'DUE_TODAY' | 'OVERDUE';
  relatedEntityId: number;
  relatedEntityType: string;
}

export interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  action: string;
  enabled: boolean;
  count?: number;
}

export interface DashboardWidget {
  id: string;
  type: 'STATS' | 'CHART' | 'ACTIVITY' | 'DUE_DATES' | 'QUICK_ACTIONS' | 'CUSTOM';
  title: string;
  position: { x: number; y: number; w: number; h: number };
  visible: boolean;
  settings?: Record<string, any>;
}

export interface EnhancedDashboardData {
  stats: DashboardStats;
  revenueData: RevenueData;
  occupancyData: OccupancyData;
  paymentMethodData: PaymentMethodData;
  recentActivities: ActivityItem[];
  upcomingDueDates: UpcomingDueDate[];
  quickActions: QuickAction[];
  widgets: DashboardWidget[];
}

export interface Notification {
  id: number;
  type: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'MAINTENANCE_REQUEST' | 'SYSTEM' | 'REMINDER';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
}

export interface NotificationSettings {
  id?: number;
  userId: number;
  emailNotifications: boolean;
  smsNotifications: boolean;
  inAppNotifications: boolean;
  pushNotifications: boolean;
  whatsappNotifications: boolean;
  invoiceDueReminders: boolean;
  paymentReceivedNotifications: boolean;
  contractExpiringReminders: boolean;
  maintenanceRequestNotifications: boolean;
  reminderDaysBefore: number;
}

// Communication & Notifications Types
export interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  templateType: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'WELCOME' | 'MAINTENANCE_REQUEST' | 'CUSTOM';
  variables: string[];
  isDefault: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SMSTemplate {
  id: number;
  name: string;
  message: string;
  templateType: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'REMINDER' | 'CUSTOM';
  variables: string[];
  active: boolean;
  createdAt: string;
}

export interface NotificationChannel {
  id: number;
  name: string;
  type: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
  configuration: Record<string, any>;
  active: boolean;
  isDefault: boolean;
  createdAt: string;
}

export interface CommunicationLog {
  id: number;
  recipientType: 'TENANT' | 'LANDLORD' | 'ADMIN';
  recipientId: number;
  recipientName: string;
  channel: 'EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP';
  templateId?: number;
  templateName?: string;
  subject?: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'DELIVERED' | 'FAILED' | 'READ';
  sentAt?: string;
  deliveredAt?: string;
  readAt?: string;
  errorMessage?: string;
  relatedEntityType?: string;
  relatedEntityId?: number;
  createdAt: string;
}

export interface BulkCommunication {
  id: number;
  name: string;
  recipientType: 'ALL_TENANTS' | 'ACTIVE_TENANTS' | 'OVERDUE_TENANTS' | 'EXPIRING_CONTRACTS' | 'CUSTOM';
  recipientIds: number[];
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP')[];
  templateId?: number;
  subject?: string;
  message: string;
  scheduledAt?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'COMPLETED' | 'FAILED';
  totalRecipients: number;
  sentCount: number;
  deliveredCount: number;
  failedCount: number;
  createdAt: string;
  sentAt?: string;
}

export interface NotificationPreference {
  id: number;
  userId: number;
  notificationType: 'INVOICE_DUE' | 'PAYMENT_RECEIVED' | 'CONTRACT_EXPIRING' | 'MAINTENANCE_REQUEST' | 'SYSTEM' | 'MARKETING';
  channels: ('EMAIL' | 'SMS' | 'PUSH' | 'WHATSAPP' | 'IN_APP')[];
  enabled: boolean;
  frequency: 'IMMEDIATE' | 'DAILY_DIGEST' | 'WEEKLY_DIGEST' | 'NEVER';
  quietHours: {
    enabled: boolean;
    startTime: string;
    endTime: string;
  };
}

// Document Management Types
export interface Document {
  id: number;
  name: string;
  originalFileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  documentType: 'CONTRACT' | 'ID_DOCUMENT' | 'RECEIPT' | 'INVOICE' | 'LEASE_AGREEMENT' | 'MAINTENANCE_REPORT' | 'INSURANCE' | 'OTHER';
  category: 'TENANT_DOCUMENTS' | 'PROPERTY_DOCUMENTS' | 'FINANCIAL_DOCUMENTS' | 'LEGAL_DOCUMENTS' | 'MAINTENANCE_DOCUMENTS';
  relatedEntityType?: string;
  relatedEntityId?: number;
  tenantId?: number;
  propertyId?: number;
  contractId?: number;
  uploadedBy: number;
  uploadedByName: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  requiresSignature: boolean;
  signatureStatus: 'NOT_REQUIRED' | 'PENDING' | 'SIGNED' | 'REJECTED';
  expiryDate?: string;
  version: number;
  parentDocumentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentTemplate {
  id: number;
  name: string;
  templateType: 'INVOICE' | 'CONTRACT' | 'LEASE_AGREEMENT' | 'RECEIPT' | 'NOTICE' | 'REPORT' | 'CUSTOM';
  content: string;
  variables: string[];
  isDefault: boolean;
  active: boolean;
  category: string;
  description?: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSignature {
  id: number;
  documentId: number;
  signerName: string;
  signerEmail: string;
  signerRole: 'TENANT' | 'LANDLORD' | 'WITNESS' | 'ADMIN';
  signatureData?: string;
  signedAt?: string;
  ipAddress?: string;
  status: 'PENDING' | 'SIGNED' | 'REJECTED' | 'EXPIRED';
  signatureRequestSentAt?: string;
  expiresAt?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface DocumentVersion {
  id: number;
  documentId: number;
  version: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  changeDescription?: string;
  uploadedBy: number;
  uploadedByName: string;
  createdAt: string;
}

export interface BulkDocumentGeneration {
  id: number;
  name: string;
  templateId: number;
  templateName: string;
  recipientType: 'ALL_TENANTS' | 'ACTIVE_TENANTS' | 'SPECIFIC_TENANTS' | 'PROPERTIES' | 'CONTRACTS';
  recipientIds: number[];
  variables: Record<string, any>;
  status: 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FAILED';
  totalDocuments: number;
  generatedCount: number;
  failedCount: number;
  outputFormat: 'PDF' | 'DOCX' | 'HTML';
  createdBy: number;
  createdByName: string;
  createdAt: string;
  completedAt?: string;
  errorMessage?: string;
}

export interface DocumentFolder {
  id: number;
  name: string;
  parentFolderId?: number;
  path: string;
  description?: string;
  isSystem: boolean;
  permissions: {
    canRead: boolean;
    canWrite: boolean;
    canDelete: boolean;
  };
  documentCount: number;
  subfolderCount: number;
  createdBy: number;
  createdAt: string;
}

export interface DocumentShare {
  id: number;
  documentId: number;
  sharedWith: number;
  sharedWithName: string;
  sharedBy: number;
  sharedByName: string;
  permissions: 'READ' | 'WRITE' | 'FULL';
  expiresAt?: string;
  accessCount: number;
  lastAccessedAt?: string;
  createdAt: string;
}

export interface ExportRequest {
  type: 'EXCEL' | 'CSV' | 'PDF';
  entity: 'INVOICES' | 'PAYMENTS' | 'CONTRACTS' | 'TENANTS' | 'PROPERTIES' | 'USERS';
  filters?: Record<string, any>;
  dateRange?: {
    startDate: string;
    endDate: string;
  };
  columns?: string[];
}

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isDefault: boolean;
  active: boolean;
}

export interface Expense {
  id: number;
  propertyId?: number;
  propertyName?: string;
  category: string;
  description: string;
  amount: number;
  currency: string;
  expenseDate: string;
  vendor?: string;
  receiptNumber?: string;
  notes?: string;
  createdAt: string;
}

export interface FinancialForecast {
  month: string;
  projectedRevenue: number;
  projectedExpenses: number;
  projectedProfit: number;
  actualRevenue?: number;
  actualExpenses?: number;
  actualProfit?: number;
}

export interface ProfitLossReport {
  period: string;
  startDate: string;
  endDate: string;
  revenue: {
    rentRevenue: number;
    serviceRevenue: number;
    otherRevenue: number;
    totalRevenue: number;
  };
  expenses: {
    maintenanceExpenses: number;
    utilitiesExpenses: number;
    administrativeExpenses: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  netProfit: number;
  profitMargin: number;
}

export interface TaxReport {
  period: string;
  taxableIncome: number;
  taxRate: number;
  taxAmount: number;
  deductions: number;
  netTaxLiability: number;
  status: 'PENDING' | 'FILED' | 'PAID';
}

export interface Deposit {
  id: number;
  contractId: number;
  contractCode: string;
  tenantName: string;
  amount: number;
  currency: string;
  depositDate: string;
  status: 'HELD' | 'REFUNDED' | 'FORFEITED';
  refundDate?: string;
  refundAmount?: number;
  deductions?: DepositDeduction[];
  notes?: string;
}

export interface DepositDeduction {
  id: number;
  description: string;
  amount: number;
  category: string;
}

export interface PaymentPlan {
  id: number;
  invoiceId: number;
  invoiceNumber: string;
  tenantName: string;
  totalAmount: number;
  installments: number;
  installmentAmount: number;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DEFAULTED';
  paidInstallments: number;
  remainingAmount: number;
  schedule: PaymentInstallment[];
}

export interface PaymentInstallment {
  id: number;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  paidDate?: string;
  paidAmount?: number;
}

// Automation & Scheduling Types
export interface RecurringInvoice {
  id: number;
  contractId: number;
  contractCode: string;
  tenantName: string;
  roomCode: string;
  frequency: 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfMonth?: number;
  dayOfWeek?: number;
  nextGenerationDate: string;
  lastGeneratedDate?: string;
  active: boolean;
  autoSend: boolean;
  template: RecurringInvoiceTemplate;
  createdAt: string;
}

export interface RecurringInvoiceTemplate {
  includeRent: boolean;
  includeServices: boolean;
  serviceIds: number[];
  customItems: RecurringInvoiceItem[];
  daysUntilDue: number;
  notes?: string;
}

export interface RecurringInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface ContractRenewalReminder {
  id: number;
  contractId: number;
  contractCode: string;
  tenantName: string;
  contractEndDate: string;
  reminderDate: string;
  daysBefore: number;
  reminderType: 'EMAIL' | 'SMS' | 'IN_APP' | 'ALL';
  sent: boolean;
  sentAt?: string;
  autoRenewal: boolean;
  renewalTerms?: ContractRenewalTerms;
  active: boolean;
  createdAt: string;
}

export interface ContractRenewalTerms {
  extensionMonths: number;
  newRentAmount?: number;
  rentIncrease?: number;
  rentIncreaseType: 'FIXED' | 'PERCENTAGE';
  requireTenantApproval: boolean;
  approvalDeadlineDays: number;
}

export interface ScheduledReport {
  id: number;
  name: string;
  reportType: 'REVENUE' | 'OCCUPANCY' | 'PAYMENTS' | 'EXPENSES' | 'FINANCIAL_SUMMARY' | 'CUSTOM';
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  dayOfWeek?: number;
  dayOfMonth?: number;
  time: string;
  recipients: string[];
  format: 'PDF' | 'EXCEL' | 'CSV';
  filters: Record<string, any>;
  nextRunDate: string;
  lastRunDate?: string;
  active: boolean;
  createdAt: string;
}

export interface AutomationRule {
  id: number;
  name: string;
  description: string;
  triggerType: 'INVOICE_OVERDUE' | 'CONTRACT_EXPIRING' | 'PAYMENT_RECEIVED' | 'SCHEDULED' | 'MANUAL';
  triggerConditions: Record<string, any>;
  actions: AutomationAction[];
  active: boolean;
  lastExecuted?: string;
  executionCount: number;
  createdAt: string;
}

export interface AutomationAction {
  type: 'SEND_EMAIL' | 'SEND_SMS' | 'UPDATE_STATUS' | 'CREATE_NOTIFICATION' | 'GENERATE_REPORT' | 'RENEW_CONTRACT';
  parameters: Record<string, any>;
  order: number;
}

export interface AutomationExecution {
  id: number;
  ruleId: number;
  ruleName: string;
  triggerData: Record<string, any>;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  executedAt: string;
  executionTime: number;
  results: AutomationExecutionResult[];
  errorMessage?: string;
}

export interface AutomationExecutionResult {
  actionType: string;
  status: 'SUCCESS' | 'FAILED';
  message: string;
  data?: Record<string, any>;
}

// Tenant Portal Types
export interface TenantProfile {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone?: string;
  idNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  occupation?: string;
  employer?: string;
  monthlyIncome?: number;
  profilePicture?: string;
  preferredLanguage: string;
  timezone: string;
  notificationPreferences: TenantNotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface TenantNotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  invoiceReminders: boolean;
  paymentConfirmations: boolean;
  maintenanceUpdates: boolean;
  contractNotifications: boolean;
  marketingEmails: boolean;
  reminderDaysBefore: number;
}

export interface TenantDashboard {
  profile: TenantProfile;
  currentContract: TenantContract;
  upcomingPayments: TenantInvoice[];
  recentPayments: TenantPayment[];
  maintenanceRequests: TenantMaintenanceRequest[];
  documents: TenantDocument[];
  notifications: TenantNotification[];
  paymentMethods: TenantPaymentMethod[];
  stats: TenantStats;
}

export interface TenantContract {
  id: number;
  contractCode: string;
  property: {
    id: number;
    name: string;
    address: string;
  };
  room: {
    id: number;
    code: string;
    floor?: string;
    type?: string;
  };
  startDate: string;
  endDate: string;
  monthlyRent: number;
  securityDeposit: number;
  status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED' | 'TERMINATED';
  renewalEligible: boolean;
  daysUntilExpiry: number;
  autoRenewal: boolean;
  nextRentDue: string;
  totalPaid: number;
  totalOutstanding: number;
}

export interface TenantInvoice {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'PARTIAL';
  items: TenantInvoiceItem[];
  paymentHistory: TenantPayment[];
  downloadUrl?: string;
  canPay: boolean;
  lateFee?: number;
  daysOverdue?: number;
}

export interface TenantInvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'RENT' | 'SERVICE' | 'UTILITY' | 'FEE' | 'OTHER';
  period?: string;
}

export interface TenantPayment {
  id: number;
  invoiceId?: number;
  invoiceNumber?: string;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  description: string;
  receiptUrl?: string;
  processingFee?: number;
  refundAmount?: number;
  refundDate?: string;
  refundReason?: string;
}

export interface TenantPaymentMethod {
  id: number;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'DIGITAL_WALLET';
  name: string;
  lastFour: string;
  expiryDate?: string;
  isDefault: boolean;
  isActive: boolean;
  provider: string;
  createdAt: string;
}

export interface TenantMaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'APPLIANCES' | 'STRUCTURAL' | 'CLEANING' | 'PEST_CONTROL' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  location: string;
  preferredTime?: string;
  allowEntry: boolean;
  photos: string[];
  submittedAt: string;
  acknowledgedAt?: string;
  scheduledAt?: string;
  completedAt?: string;
  assignedTechnician?: string;
  technicianPhone?: string;
  estimatedCost?: number;
  actualCost?: number;
  workDescription?: string;
  tenantRating?: number;
  tenantFeedback?: string;
  updates: MaintenanceUpdate[];
}

export interface MaintenanceUpdate {
  id: number;
  message: string;
  type: 'STATUS_CHANGE' | 'SCHEDULE_UPDATE' | 'TECHNICIAN_NOTE' | 'COMPLETION' | 'COST_UPDATE';
  createdAt: string;
  createdBy: string;
  attachments?: string[];
}

export interface TenantDocument {
  id: number;
  name: string;
  type: 'LEASE_AGREEMENT' | 'INVOICE' | 'RECEIPT' | 'NOTICE' | 'POLICY' | 'OTHER';
  description?: string;
  fileSize: number;
  uploadDate: string;
  downloadUrl: string;
  isImportant: boolean;
  requiresAction: boolean;
  expiryDate?: string;
  category: string;
}

export interface TenantNotification {
  id: number;
  type: 'INVOICE' | 'PAYMENT' | 'MAINTENANCE' | 'CONTRACT' | 'GENERAL' | 'SYSTEM';
  title: string;
  message: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  read: boolean;
  actionRequired: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
  relatedEntityId?: number;
  relatedEntityType?: string;
}

export interface TenantStats {
  totalPaid: number;
  totalOutstanding: number;
  onTimePayments: number;
  latePayments: number;
  averagePaymentTime: number;
  contractDuration: number;
  maintenanceRequests: number;
  resolvedRequests: number;
  averageResolutionTime: number;
  paymentHistory: {
    month: string;
    amount: number;
    onTime: boolean;
  }[];
}

export interface PaymentGateway {
  id: number;
  name: string;
  type: 'STRIPE' | 'PAYPAL' | 'SQUARE' | 'BANK_TRANSFER' | 'CRYPTO';
  isActive: boolean;
  supportedMethods: ('CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'DIGITAL_WALLET')[];
  processingFee: number;
  feeType: 'FIXED' | 'PERCENTAGE';
  minAmount?: number;
  maxAmount?: number;
  currency: string;
  configuration: Record<string, any>;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  status: 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'CANCELLED';
  clientSecret?: string;
  errorMessage?: string;
  metadata: Record<string, any>;
  createdAt: string;
}

export interface TenantFeedback {
  id: number;
  type: 'MAINTENANCE' | 'PAYMENT' | 'GENERAL' | 'SUGGESTION' | 'COMPLAINT';
  subject: string;
  message: string;
  rating?: number;
  category?: string;
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  attachments: string[];
}

export interface TenantAnnouncement {
  id: number;
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'POLICY' | 'EVENT' | 'EMERGENCY';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL_TENANTS' | 'PROPERTY_TENANTS' | 'SPECIFIC_TENANTS';
  propertyIds?: number[];
  tenantIds?: number[];
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  readBy: number[];
  attachments: string[];
  createdBy: string;
  createdAt: string;
}

export interface TenantCommunity {
  id: number;
  name: string;
  description: string;
  type: 'PROPERTY' | 'BUILDING' | 'NEIGHBORHOOD';
  memberCount: number;
  isPublic: boolean;
  rules: string[];
  moderators: string[];
  recentPosts: CommunityPost[];
  events: CommunityEvent[];
}

export interface CommunityPost {
  id: number;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  type: 'DISCUSSION' | 'QUESTION' | 'ANNOUNCEMENT' | 'EVENT' | 'MARKETPLACE';
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
  createdAt: string;
  attachments: string[];
}

export interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  organizer: string;
  maxAttendees?: number;
  currentAttendees: number;
  isAttending: boolean;
  type: 'SOCIAL' | 'MAINTENANCE' | 'MEETING' | 'EMERGENCY' | 'OTHER';
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
}

// Advanced Search & AI Types
export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description: string;
  score: number;
  highlights?: Record<string, string[]>;
  metadata?: Record<string, any>;
  source?: Record<string, any>;
}

export interface SearchSuggestion {
  text: string;
  score: number;
  category: string;
  type?: string;
}

export interface SearchAnalytics {
  id: number;
  query: string;
  searchType: string;
  resultId?: string;
  action?: string;
  userId?: number;
  sessionId?: string;
  resultsCount?: number;
  responseTime?: number;
  clickedPosition?: number;
  metadata?: string;
  timestamp: string;
}

export interface SearchConfig {
  id: number;
  configKey: string;
  elasticsearchEnabled: boolean;
  fuzzySearchEnabled: boolean;
  autoCompleteEnabled: boolean;
  searchAnalyticsEnabled: boolean;
  semanticSearchEnabled: boolean;
  aiInsightsEnabled: boolean;
  recommendationsEnabled: boolean;
  maxResults: number;
  searchTimeout: number;
  autocompleteLimit: number;
  suggestionsLimit: number;
  minQueryLength: number;
  maxQueryLength: number;
  cacheEnabled: boolean;
  cacheTtl: number;
  logQueries: boolean;
  logResults: boolean;
  boostRecentResults: boolean;
  boostPopularResults: boolean;
  personalizationEnabled: boolean;
  indexSettings?: Record<string, any>;
  analyzerSettings?: Record<string, any>;
  boostFields?: Record<string, number>;
}

export interface AIInsight {
  type: string;
  title: string;
  description: string;
  confidence: number;
  data: Record<string, any>;
  generatedAt?: string;
  category?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actionable?: boolean;
  estimatedImpact?: number;
}

export interface SmartRecommendation {
  id: string;
  type: 'PROPERTY' | 'TENANT' | 'PRICING' | 'MAINTENANCE' | 'INVESTMENT' | 'OPTIMIZATION';
  title: string;
  description: string;
  score: number;
  confidence: number;
  category: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  estimatedBenefit?: number;
  estimatedCost?: number;
  timeframe?: string;
  effort?: 'LOW' | 'MEDIUM' | 'HIGH';
  action?: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  expiresAt?: string;
}

export interface SearchTrends {
  volumeTrends: Array<{
    date: string;
    volume: number;
  }>;
  trendingQueries: Array<{
    query: string;
    count: number;
    growth: number;
  }>;
  categories: Record<string, number>;
  popularSearches: Array<{
    query: string;
    count: number;
    category: string;
  }>;
  failedSearches?: Array<{
    query: string;
    count: number;
  }>;
  conversionRates?: Array<{
    query: string;
    rate: number;
  }>;
}

export interface SearchRequest {
  query: string;
  type?: 'FULL_TEXT' | 'NATURAL_LANGUAGE' | 'SEMANTIC' | 'ADVANCED' | 'FACETED';
  filters?: Record<string, any>;
  sorting?: {
    field: string;
    order: 'ASC' | 'DESC';
  };
  pagination?: {
    page: number;
    size: number;
  };
  facets?: string[];
  context?: string;
  userId?: number;
  sessionId?: string;
}

export interface SearchResponse {
  hits: SearchResult[];
  total: number;
  maxScore: number;
  took: number;
  page?: number;
  size?: number;
  facets?: Record<string, any>;
  suggestions?: SearchSuggestion[];
  queryAnalysis?: {
    intent: string;
    entities: string[];
    parameters: Record<string, string>;
    confidence: number;
  };
}

export interface PredictionRequest {
  type: 'REVENUE' | 'OCCUPANCY' | 'MAINTENANCE_COSTS' | 'TENANT_CHURN' | 'MARKET_TRENDS';
  parameters: Record<string, any>;
  timeframe?: string;
  confidence?: number;
}

export interface PredictionResponse {
  predictionType: string;
  predictions: Record<string, any>;
  confidence: number;
  generatedAt: string;
  methodology?: string;
  assumptions?: string[];
  limitations?: string[];
}

// Localization Types
export interface Language {
  id: number;
  name: string;
  nativeName: string;
  code: string;
  countryCode: string;
  direction: 'LTR' | 'RTL';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Translation {
  id: number;
  languageCode: string;
  category: string;
  key: string;
  value: string;
  description?: string;
  context?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocaleConfig {
  id: number;
  name: string;
  code: string;
  languageCode: string;
  countryCode: string;
  currencyCode: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  createdAt: string;
  updatedAt: string;
}

export interface CurrencyLocalization {
  id: number;
  code: string;
  name: string;
  symbol: string;
  symbolPosition: 'BEFORE' | 'AFTER';
  decimalPlaces: number;
  decimalSeparator: string;
  thousandsSeparator: string;
  createdAt: string;
  updatedAt: string;
}

export interface DateTimeFormat {
  id: number;
  name: string;
  localeCode: string;
  datePattern: string;
  timePattern: string;
  dateTimePattern: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegionalCompliance {
  id: number;
  countryCode: string;
  countryName: string;
  taxIdFormat?: string;
  phoneFormat?: string;
  postalCodeFormat?: string;
  addressFormat?: string;
  legalRequirements?: string;
  dataProtectionRules?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserLocalizationPreference {
  id: number;
  userId: number;
  languageCode: string;
  localeCode: string;
  currencyCode: string;
  timeZone: string;
  dateFormat: string;
  timeFormat: string;
  numberFormat: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalizedTemplate {
  id: number;
  templateType: string;
  languageCode: string;
  name: string;
  content: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LocalizationStatistics {
  totalLanguages: number;
  totalTranslations: number;
  translationsByLanguage: Record<string, number>;
  completionRates: Record<string, number>;
}

export interface TranslationValidationIssue {
  type: string;
  category: string;
  key: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface AutoTranslationRequest {
  sourceLanguage: string;
  targetLanguage: string;
  text: string;
}

export interface AutoTranslationResponse {
  success: boolean;
  sourceLanguage: string;
  targetLanguage: string;
  originalText: string;
  translatedText: string;
  confidence: number;
  error?: string;
}

export interface LocalizationTestResult {
  languageCode: string;
  localeCode: string;
  tests: {
    translations: {
      totalTranslations: number;
      emptyTranslations: number;
      completionRate: number;
      status: 'PASS' | 'FAIL';
    };
    currency: {
      testAmount: number;
      formattedAmount: string;
      currencyCode: string;
      status: 'PASS' | 'FAIL';
      error?: string;
    };
    dateTime: {
      testDateTime: string;
      formattedDate: string;
      formattedTime: string;
      formattedDateTime: string;
      status: 'PASS' | 'FAIL';
      error?: string;
    };
    compliance: {
      countryCode: string;
      countryName: string;
      hasComplianceRules: boolean;
      status: 'PASS' | 'FAIL';
      error?: string;
    };
  };
}

// Messaging & Communication Types
export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderType: 'LANDLORD' | 'TENANT' | 'ADMIN';
  recipientId: number;
  recipientName: string;
  recipientType: 'LANDLORD' | 'TENANT' | 'ADMIN';
  subject: string;
  content: string;
  messageType: 'DIRECT' | 'GROUP' | 'ANNOUNCEMENT' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  threadId?: number;
  parentMessageId?: number;
  propertyId?: number;
  contractId?: number;
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  attachments?: string[];
  tags?: string[];
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageThread {
  id: number;
  participants: {
    id: number;
    name: string;
    type: string;
  }[];
  subject: string;
  lastMessage: Message;
  messageCount: number;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MessagingAnnouncement {
  id: number;
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'POLICY' | 'EVENT' | 'EMERGENCY' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL_TENANTS' | 'PROPERTY_TENANTS' | 'SPECIFIC_TENANTS' | 'LANDLORDS';
  propertyIds?: number[];
  tenantIds?: number[];
  authorId: number;
  authorName: string;
  authorType: 'LANDLORD' | 'ADMIN' | 'SYSTEM';
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  isPinned: boolean;
  requiresAcknowledgment: boolean;
  readBy?: number[];
  acknowledgedBy?: number[];
  attachments?: string[];
  tags?: string[];
  viewCount: number;
  acknowledgmentCount: number;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessagingPropertyEvent {
  id: number;
  title: string;
  description?: string;
  type: 'MAINTENANCE' | 'INSPECTION' | 'SOCIAL' | 'MEETING' | 'EMERGENCY' | 'COMMUNITY' | 'OTHER';
  category: 'MANDATORY' | 'OPTIONAL' | 'INFORMATIONAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDateTime: string;
  endDateTime: string;
  location: string;
  locationDetails?: string;
  propertyId: number;
  propertyName: string;
  organizerId: number;
  organizerName: string;
  organizerType: 'LANDLORD' | 'ADMIN' | 'TENANT' | 'VENDOR';
  maxAttendees?: number;
  currentAttendees: number;
  attendeeIds?: number[];
  invitedIds?: number[];
  declinedIds?: number[];
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  isPublic: boolean;
  requiresRSVP: boolean;
  allowGuestInvites: boolean;
  rsvpDeadline?: string;
  attachments?: string[];
  tags?: string[];
  notes?: string;
  requirements?: string;
  agenda?: string;
  contactInfo?: string;
  sendReminders: boolean;
  reminderHours: number;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessagingTenantFeedback {
  id: number;
  tenantId: number;
  tenantName: string;
  propertyId: number;
  propertyName: string;
  contractId?: number;
  type: 'MAINTENANCE' | 'PAYMENT' | 'GENERAL' | 'SUGGESTION' | 'COMPLAINT' | 'SERVICE' | 'PROPERTY';
  category: 'URGENT' | 'IMPROVEMENT' | 'COMPLIMENT' | 'ISSUE' | 'FEATURE_REQUEST';
  subject: string;
  message: string;
  rating?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  attachments?: string[];
  tags?: string[];
  isAnonymous: boolean;
  allowFollowUp: boolean;
  isPublic: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: number;
  acknowledgedByName?: string;
  resolvedAt?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: number;
  respondedByName?: string;
  resolutionNotes?: string;
  internalNotes?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  requiresAction: boolean;
  actionDueDate?: string;
  assignedTo?: number;
  assignedToName?: string;
  actionPlan?: string;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessagingStatistics {
  messagesByType: Record<string, number>;
  messagesByPriority: Record<string, number>;
  announcementsByType: Record<string, number>;
  eventsByType: Record<string, number>;
  feedbackByType: Record<string, number>;
  averageFeedbackRating: number;
  averageSatisfactionRating: number;
}

export interface MessagingDashboardData {
  recentMessages: Message[];
  unreadMessageCount: number;
  recentAnnouncements: MessagingAnnouncement[];
  upcomingEvents: MessagingPropertyEvent[];
  recentFeedback: MessagingTenantFeedback[];
}

// Communication Features Types
export interface Message {
  id: number;
  senderId: number;
  senderName: string;
  senderType: 'LANDLORD' | 'TENANT' | 'ADMIN';
  recipientId: number;
  recipientName: string;
  recipientType: 'LANDLORD' | 'TENANT' | 'ADMIN';
  subject: string;
  content: string;
  messageType: 'DIRECT' | 'GROUP' | 'ANNOUNCEMENT' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  threadId?: number;
  parentMessageId?: number;
  propertyId?: number;
  contractId?: number;
  isRead: boolean;
  readAt?: string;
  isArchived: boolean;
  archivedAt?: string;
  isDeleted: boolean;
  deletedAt?: string;
  attachments: string[];
  tags: string[];
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessageThread {
  threadId: number;
  participants: {
    id: number;
    name: string;
    type: string;
  }[];
  subject: string;
  lastMessage: Message;
  messageCount: number;
  unreadCount: number;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: 'GENERAL' | 'MAINTENANCE' | 'POLICY' | 'EVENT' | 'EMERGENCY' | 'SYSTEM';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  targetAudience: 'ALL_TENANTS' | 'PROPERTY_TENANTS' | 'SPECIFIC_TENANTS' | 'LANDLORDS';
  propertyIds?: number[];
  tenantIds?: number[];
  authorId: number;
  authorName: string;
  authorType: 'LANDLORD' | 'ADMIN' | 'SYSTEM';
  publishDate: string;
  expiryDate?: string;
  isActive: boolean;
  isPinned: boolean;
  requiresAcknowledgment: boolean;
  readBy: number[];
  acknowledgedBy: number[];
  attachments: string[];
  tags: string[];
  viewCount: number;
  acknowledgmentCount: number;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PropertyEvent {
  id: number;
  title: string;
  description?: string;
  type: 'MAINTENANCE' | 'INSPECTION' | 'SOCIAL' | 'MEETING' | 'EMERGENCY' | 'COMMUNITY' | 'OTHER';
  category: 'MANDATORY' | 'OPTIONAL' | 'INFORMATIONAL';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  startDateTime: string;
  endDateTime: string;
  location: string;
  locationDetails?: string;
  propertyId: number;
  propertyName: string;
  organizerId: number;
  organizerName: string;
  organizerType: 'LANDLORD' | 'ADMIN' | 'TENANT' | 'VENDOR';
  maxAttendees?: number;
  currentAttendees: number;
  attendeeIds: number[];
  invitedIds: number[];
  declinedIds: number[];
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
  isPublic: boolean;
  requiresRSVP: boolean;
  allowGuestInvites: boolean;
  rsvpDeadline?: string;
  attachments: string[];
  tags: string[];
  notes?: string;
  requirements?: string;
  agenda?: string;
  contactInfo?: string;
  sendReminders: boolean;
  reminderHours: number;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TenantFeedback {
  id: number;
  tenantId: number;
  tenantName: string;
  propertyId: number;
  propertyName: string;
  contractId?: number;
  type: 'MAINTENANCE' | 'PAYMENT' | 'GENERAL' | 'SUGGESTION' | 'COMPLAINT' | 'SERVICE' | 'PROPERTY';
  category: 'URGENT' | 'IMPROVEMENT' | 'COMPLIMENT' | 'ISSUE' | 'FEATURE_REQUEST';
  subject: string;
  message: string;
  rating?: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'SUBMITTED' | 'ACKNOWLEDGED' | 'IN_REVIEW' | 'RESOLVED' | 'CLOSED' | 'REJECTED';
  attachments: string[];
  tags: string[];
  isAnonymous: boolean;
  allowFollowUp: boolean;
  isPublic: boolean;
  acknowledgedAt?: string;
  acknowledgedBy?: number;
  acknowledgedByName?: string;
  resolvedAt?: string;
  resolvedBy?: number;
  resolvedByName?: string;
  response?: string;
  respondedAt?: string;
  respondedBy?: number;
  respondedByName?: string;
  resolutionNotes?: string;
  internalNotes?: string;
  satisfactionRating?: number;
  satisfactionComment?: string;
  requiresAction: boolean;
  actionDueDate?: string;
  assignedTo?: number;
  assignedToName?: string;
  actionPlan?: string;
  metadata?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MessagingStatistics {
  messagesByType: Record<string, number>;
  messagesByPriority: Record<string, number>;
  announcementsByType: Record<string, number>;
  eventsByType: Record<string, number>;
  feedbackByType: Record<string, number>;
  averageFeedbackRating: number;
  averageSatisfactionRating: number;
}

export interface MessagingDashboard {
  recentMessages: Message[];
  unreadMessageCount: number;
  recentAnnouncements: Announcement[];
  upcomingEvents: PropertyEvent[];
  recentFeedback: TenantFeedback[];
}

