export interface ApiResponse<T> {
  isSuccess: boolean;
  isFailure: boolean;
  value: {
    code: string;
    message: string;
    data: T;
  };
  error?: {
    code: string;
    message: string;
  };
}

export interface ShippingAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

export interface PaymentTransaction {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  occurredAt: string;
  externalRef: string;
  paymentId: string;
}

export interface OrderPayment {
  id: string;
  orderId: string;
  amount: number;
  discountRate: number;
  netAmount: number;
  method: string;
  status: string;
  paymentIntentId: string;
  paidAt: string;
  refundedAmount: number;
}

export interface Shipment {
  id: string;
  orderDetailId?: string;
  orderDetails?: string;
  orderCode: string;
  totalFee: number;
  mainServiceFee: number;
  shippingFee?: number; // Add shipping fee for inventory items
  provider: string;
  trackingNumber: string;
  shippedAt: string;
  estimatedDelivery: string;
  status: string;
  estimatedPickupTime: string;
  pickedUpAt: string;
  inventoryItems?: any;
}

export interface OrderDetail {
  id: string;
  productId: string;
  orderId: string;
  logs: string;
  productName: string;
  productImages: string[];
  blindBoxId?: string;
  blindBoxName?: string;
  blindBoxImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  shipments: Shipment[];
  detailDiscountPromotion: number;
  inventoryItems?: [];
  finalDetailPrice?: number;
}

export interface Order {
  id: string;
  status: string;
  totalAmount: number;
  placedAt: string;
  completedAt?: string;
  shippingAddress: ShippingAddress;
  transactions: PaymentTransaction[];
  sessionId: string;
  finalAmount: number;
  totalShippingFee: number;
  checkoutGroupId: string;
  sellerId: string;
  seller: {
    sellerId: string;
    userId: string;
    fullName: string;
  };
  payment: OrderPayment;
  details: OrderDetail[];
}

export interface OrdersListResponse {
  result: Order[];
}

export interface OrderDetailsListResponse {
  result: OrderDetail[];
}

export interface SingleOrderResponse {
  result: Order;
}

export interface TrackingInfo {
  orderId: string;
  orderDetailId: string;
  productName: string;
  productImages: string[];
  quantity: number;
  totalPrice: number;
  status: string;
  placedAt: string;
  completedAt?: string;
  estimatedDelivery?: string;
  estimatedPickupTime?: string;
  shippedAt?: string;
  pickedUpAt?: string;
  shipment?: Shipment;
  logs: string;
  totalPayment: number;
}

export interface OrderSummary {
  id: string;
  status: string;
  totalAmount: number;
  totalShippingFee: number;
  finalAmount: number;
  totalPayment: number;
  placedAt: string;
  completedAt?: string;
  itemCount: number;
  firstProductImage?: string;
  firstProductName?: string;
}

export interface InventoryItem {
  id: string;
  userId: string;
  productId: string;
  orderId: string;
  logs: string;
  productName?: string;
  productImages: string[];
  blindBoxId?: string;
  blindBoxName?: string;
  blindBoxImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  status: string;
  shipments?: Shipment[]; // Optional array for backward compatibility
  shipment?: Shipment; // Single shipment object
  shipmentId?: string; // Shipment ID reference
  inventoryItems?: any[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  orderDetailId?: string;
  product?: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    price: number;
    stock: number;
    productStockStatus: string;
    height: number;
    material: string;
    productType: string;
    brand: string;
    status: string;
    imageUrls: string[];
  };
  location?: string;
  isFromBlindBox: boolean;
  sourceCustomerBlindBoxId?: string;
  holdInfo?: string;
}

export interface InventoryItemsListResponse {
  result: InventoryItem[];
}

export interface SingleInventoryItemResponse {
  result: InventoryItem;
}
