export interface OrderRequest {
  userId: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  payment: PaymentRequest;
}

export interface PaymentRequest {
  amount: number;
  method: string;
  paymentStatus: string;
  paymentDate: string;
}

export interface OrderResponse {
  id: number;
  userId: number;
  totalPrice: number;
  status: string;
  createdAt: string;
  payment: PaymentResponse;
}

export interface PaymentResponse {
  id: number;
  amount: number;
  method: string;
  paymentStatus: string;
  paymentDate: string;
}