/**
 * Format ngày giờ theo định dạng Việt Nam
 * @param {string|Date} date - Ngày cần format
 * @returns {string} - Chuỗi ngày dạng "dd/MM/yyyy"
 */
export function formatDate(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * Format ngày giờ đầy đủ
 * @param {string|Date} date
 * @returns {string} - Chuỗi dạng "dd/MM/yyyy HH:mm"
 */
export function formatDateTime(date) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

/**
 * Tính khoảng thời gian tương đối (ví dụ: "2 giờ trước", "3 ngày trước")
 * @param {string|Date} date
 * @returns {string}
 */
export function timeAgo(date) {
  if (!date) return "—";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;

  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) return "Vừa xong";
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  if (diffMonths < 12) return `${diffMonths} tháng trước`;
  return `${diffYears} năm trước`;
}

/**
 * Kiểm tra xem ngày có phải hôm nay không
 * @param {string|Date} date
 * @returns {boolean}
 */
export function isToday(date) {
  if (!date) return false;
  const today = new Date();
  const d = new Date(date);
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  );
}
