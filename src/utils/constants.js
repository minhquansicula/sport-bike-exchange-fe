// Trạng thái bài đăng xe
export const POST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  SOLD: "SOLD",
  HIDDEN: "HIDDEN",
};

export const POST_STATUS_LABEL = {
  [POST_STATUS.PENDING]: "Chờ duyệt",
  [POST_STATUS.APPROVED]: "Đã duyệt",
  [POST_STATUS.REJECTED]: "Bị từ chối",
  [POST_STATUS.SOLD]: "Đã bán",
  [POST_STATUS.HIDDEN]: "Đã ẩn",
};

export const POST_STATUS_COLOR = {
  [POST_STATUS.PENDING]: "yellow",
  [POST_STATUS.APPROVED]: "green",
  [POST_STATUS.REJECTED]: "red",
  [POST_STATUS.SOLD]: "blue",
  [POST_STATUS.HIDDEN]: "gray",
};

// Trạng thái giao dịch
export const TRANSACTION_STATUS = {
  PENDING: "PENDING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
};

export const TRANSACTION_STATUS_LABEL = {
  [TRANSACTION_STATUS.PENDING]: "Đang xử lý",
  [TRANSACTION_STATUS.COMPLETED]: "Hoàn thành",
  [TRANSACTION_STATUS.CANCELLED]: "Đã hủy",
  [TRANSACTION_STATUS.REFUNDED]: "Đã hoàn tiền",
};

// Vai trò người dùng
export const USER_ROLE = {
  ADMIN: "ADMIN",
  USER: "USER",
  INSPECTOR: "INSPECTOR",
};

// Phân loại xe
export const BIKE_CATEGORY = {
  ROAD: "ROAD",
  MOUNTAIN: "MOUNTAIN",
  HYBRID: "HYBRID",
  BMX: "BMX",
  ELECTRIC: "ELECTRIC",
  FOLDING: "FOLDING",
};

export const BIKE_CATEGORY_LABEL = {
  [BIKE_CATEGORY.ROAD]: "Xe đường trường",
  [BIKE_CATEGORY.MOUNTAIN]: "Xe địa hình",
  [BIKE_CATEGORY.HYBRID]: "Xe đa dụng",
  [BIKE_CATEGORY.BMX]: "Xe BMX",
  [BIKE_CATEGORY.ELECTRIC]: "Xe điện",
  [BIKE_CATEGORY.FOLDING]: "Xe gấp",
};

// Tình trạng xe
export const BIKE_CONDITION = {
  NEW: "NEW",
  LIKE_NEW: "LIKE_NEW",
  GOOD: "GOOD",
  FAIR: "FAIR",
  POOR: "POOR",
};

export const BIKE_CONDITION_LABEL = {
  [BIKE_CONDITION.NEW]: "Mới",
  [BIKE_CONDITION.LIKE_NEW]: "Như mới",
  [BIKE_CONDITION.GOOD]: "Tốt",
  [BIKE_CONDITION.FAIR]: "Khá",
  [BIKE_CONDITION.POOR]: "Kém",
};

// Phân trang mặc định
export const DEFAULT_PAGE_SIZE = 12;
export const DEFAULT_PAGE = 1;

// Giới hạn ảnh upload
export const MAX_IMAGES_PER_POST = 5;
export const MAX_IMAGE_SIZE_MB = 5;
