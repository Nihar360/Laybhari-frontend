export interface User {
  userId: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  role: string;
}

export interface ProductVariant {
  id: number;
  weightLabel: string;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price?: number; // fallback calculated from first variant
  stock?: number; // fallback calculated from first variant
  imageUrl: string | null;
  isActive: boolean;
  categoryId: number;
  categoryName: string;
  variants: ProductVariant[];
  rating?: number;
  reviewCount?: number;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
}

export interface PageableResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string | null;
  productVariantId: number;
  weightLabel: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartResponse {
  id: number;
  userId: number;
  items: CartItem[];
  grandTotal: number;
  totalItems: number;
}

export interface Address {
  id: number;
  userId: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  createdAt?: string;
}

export interface AddressRequest {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface OrderItem {
  id: number;
  productVariantId: number;
  productName: string;
  weightLabel: string;
  price: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  userId: number;
  address: Address;
  status: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CheckoutRequest {
  addressId: number;
}

export interface CreatePaymentResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}
