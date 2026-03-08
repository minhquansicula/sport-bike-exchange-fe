/**
 * Format số tiền sang VNĐ (ví dụ: 5.000.000 ₫)
 */
export default function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return "—";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

/**
 * Format số tiền gọn (ví dụ: 5tr, 1.2tr, 500k)
 */
export function formatCurrencyCompact(amount) {
  if (amount == null || isNaN(amount)) return "—";
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000;
    return `${millions % 1 === 0 ? millions : millions.toFixed(1)}tr ₫`;
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000;
    return `${thousands % 1 === 0 ? thousands : thousands.toFixed(1)}k ₫`;
  }
  return `${amount} ₫`;
}

/**
 * Parse chuỗi tiền về số (ví dụ: "5.000.000" → 5000000)
 */
export function parseCurrency(str) {
  if (!str) return 0;
  return Number(String(str).replace(/[^\d]/g, ""));
}

