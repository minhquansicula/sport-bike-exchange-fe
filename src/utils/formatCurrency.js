// Thêm chữ 'default' vào ngay sau chữ export
export default function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}
