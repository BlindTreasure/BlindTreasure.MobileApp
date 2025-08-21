// Order level status mapping
export const ORDER_STATUS_MAP = {
  PENDING: "Chờ xác nhận",
  PAID: "Đã thanh toán",
  PROCESSING: "Chờ lấy hàng",
  DELIVERING: "Chờ giao hàng",
  DELIVERED: "Đã giao",
  COMPLETED: "Đã giao",
  CANCELLED: "Đã hủy",
  RETURNED: "Trả hàng",
  REFUNDED: "Đã hoàn tiền",
  EXPIRED: "Đã hủy",
  // Add case-sensitive variants for inventory items
  Delivering: "Đang giao hàng",
  Delivered: "Đã giao",
  IN_INVENTORY: "Trong túi đồ",
};

// Order detail item status mapping (from backend enum)
export const ORDER_DETAIL_STATUS_MAP = {
  PENDING: "Chờ xử lý",
  IN_INVENTORY: "Trong túi đồ",
  SHIPPING_REQUESTED: "Đã yêu cầu giao hàng",
  PARTIALLY_SHIPPING_REQUESTED: "Yêu cầu giao hàng một phần",
  DELIVERING: "Đang giao hàng",
  PARTIALLY_DELIVERING: "Đang giao hàng một phần",
  DELIVERED: "Đã giao hàng",
  PARTIALLY_DELIVERED: "Đã giao hàng một phần",
  CANCELLED: "Đã hủy",
};

export const ORDER_STATUS_COLORS = {
  PENDING: "#FF9500",
  PAID: "#34C759",
  PROCESSING: "#007AFF",
  DELIVERING: "#FF6B35",
  DELIVERED: "#34C759",
  COMPLETED: "#34C759",
  CANCELLED: "#FF3B30",
  RETURNED: "#FF9500",
  REFUNDED: "#34C759",
  EXPIRED: "#FF3B30",
  // Add case-sensitive variants for inventory items
  Delivering: "#FF6B35",
  Delivered: "#34C759",
  IN_INVENTORY: "#007AFF",
};

// Order detail item status colors
export const ORDER_DETAIL_STATUS_COLORS = {
  PENDING: "#FF9500",
  IN_INVENTORY: "#007AFF",
  SHIPPING_REQUESTED: "#FF6B35",
  PARTIALLY_SHIPPING_REQUESTED: "#FF9500",
  DELIVERING: "#FF6B35",
  PARTIALLY_DELIVERING: "#FF9500",
  DELIVERED: "#34C759",
  PARTIALLY_DELIVERED: "#34C759",
  CANCELLED: "#FF3B30",
};

// Helper function to get status display name
export const getOrderStatusText = (status: string): string => {
  return ORDER_STATUS_MAP[status as keyof typeof ORDER_STATUS_MAP] || status;
};

// Helper function to get status color
export const getOrderStatusColor = (status: string): string => {
  return (
    ORDER_STATUS_COLORS[status as keyof typeof ORDER_STATUS_COLORS] || "#8E8E93"
  );
};

// Helper function to get order detail status display name
export const getOrderDetailStatusText = (status: string): string => {
  return (
    ORDER_DETAIL_STATUS_MAP[status as keyof typeof ORDER_DETAIL_STATUS_MAP] ||
    status
  );
};

// Helper function to get order detail status color
export const getOrderDetailStatusColor = (status: string): string => {
  return (
    ORDER_DETAIL_STATUS_COLORS[
      status as keyof typeof ORDER_DETAIL_STATUS_COLORS
    ] || "#8E8E93"
  );
};

// Check if order has trackable items (any delivering status)
export const hasTrackableItems = (orderDetails: any[]): boolean => {
  if (!Array.isArray(orderDetails)) return false;

  return orderDetails.some(
    (detail) =>
      detail.status === "DELIVERING" ||
      detail.status === "PARTIALLY_DELIVERING" ||
      detail.status === "SHIPPING_REQUESTED" ||
      detail.status === "PARTIALLY_SHIPPING_REQUESTED"
  );
};

// Get the most relevant status for tracking
export const getTrackingStatus = (orderDetails: any[]): string | null => {
  if (!Array.isArray(orderDetails)) return null;

  // Priority order for tracking
  const trackingPriority = [
    "DELIVERING",
    "PARTIALLY_DELIVERING",
    "SHIPPING_REQUESTED",
    "PARTIALLY_SHIPPING_REQUESTED",
  ];

  for (const status of trackingPriority) {
    const detail = orderDetails.find((d) => d.status === status);
    if (detail) return detail.id;
  }

  return null;
};
