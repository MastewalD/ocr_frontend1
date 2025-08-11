import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export interface Item {
  id: string;
  name: string;
  price: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Receipt {
  id: string;
  storeName: string;
  dateOfPurchase: string; 
  totalAmount: number;
  category: string;
  items: Item[];
  user?: User; 
}

export interface ReceiptsData {
  receipts: Receipt[]; 
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface SingleReceiptData {
  message: string;
  receipt: Receipt;
}

interface UploadedReceipt {
  storeName: string;
  dateOfPurchase: string;
  totalAmount: number;
  items: Item[]; 
}

interface UploadReceiptResponse {
  message: string;
  receipt: UploadedReceipt;
}

export interface UploadReceiptMutationData {
  uploadReceipt: UploadReceiptResponse;
}