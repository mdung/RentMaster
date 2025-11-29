export interface User {
  username: string;
  role: string;
  fullName: string;
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

export interface DashboardStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  activeContracts: number;
  totalOutstanding: number;
  monthlyRevenue: number;
}

