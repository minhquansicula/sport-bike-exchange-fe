import React, { createContext, useContext, useState, useEffect } from "react";

// Dữ liệu mẫu ban đầu
const INITIAL_TRANSACTIONS = [
  {
    id: 1001,
    bikeId: 1,
    bikeName: "Trek Marlin 7 Gen 2",
    image:
      "https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg",
    price: 12500000,
    sellerName: "Nguyễn Văn A",
    status: "pending_seller", // Chờ người bán xác nhận
    createdAt: "2024-03-20T08:00:00.000Z",
  },
  {
    id: 1002,
    bikeId: 2,
    bikeName: "Giant Escape 2 City",
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80",
    price: 8200000,
    sellerName: "Trần Bảo B",
    status: "pending_admin", // Chờ Admin xếp lịch
    createdAt: "2024-03-19T14:30:00.000Z",
  },
  {
    id: 1003,
    bikeId: 3,
    bikeName: "Specialized Allez E5",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
    price: 21000000,
    sellerName: "Lê C",
    status: "scheduled", // Đã có lịch hẹn
    meetingLocation: "Trạm OldBike Cầu Giấy - 123 Xuân Thủy",
    meetingTime: "2024-03-25T09:00:00.000Z",
    inspectorName: "Kỹ Thuật Viên Hùng",
    createdAt: "2024-03-18T10:00:00.000Z",
  },
];

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);

  // Load data từ LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem("transactions");
    if (stored) {
      setTransactions(JSON.parse(stored));
    } else {
      setTransactions(INITIAL_TRANSACTIONS);
    }
  }, []);

  // Sync data vào LocalStorage
  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    }
  }, [transactions]);

  // --- LOGIC ---

  // 1. Tạo đơn mới
  const createTransaction = (bike, user) => {
    const newTx = {
      id: Date.now(),
      bikeId: bike.id,
      bikeName: bike.name,
      image: bike.image,
      price: bike.price,
      sellerName: bike.seller?.name || "Người bán",
      status: "pending_seller",
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    return newTx;
  };

  // 2. Người bán chấp nhận
  const sellerAcceptTransaction = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "pending_admin" } : t)),
    );
  };

  // 3. Người bán từ chối
  const sellerRejectTransaction = (id) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "rejected" } : t)),
    );
  };

  // 4. (Giả lập) Admin xếp lịch - Để test
  // Bạn có thể gọi hàm này từ console hoặc tạo nút ẩn để test
  const _adminScheduleMock = (id) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "scheduled",
              meetingLocation: "Trạm OldBike Quận 1 - 45 Nguyễn Huệ",
              meetingTime: new Date(Date.now() + 86400000).toISOString(), // Ngày mai
              inspectorName: "Admin Test",
            }
          : t,
      ),
    );
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        createTransaction,
        sellerAcceptTransaction,
        sellerRejectTransaction,
        _adminScheduleMock,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);
