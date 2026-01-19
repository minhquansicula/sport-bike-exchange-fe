// src/mockData/bikes.js

export const MOCK_BIKES = [
  {
    id: 1,
    name: "Trek Marlin 7 Gen 2 (2022)",
    price: 12500000,
    originalPrice: 15500000, // Giá gốc để tính % giảm (nếu cần)
    brand: "Trek",
    type: "MTB",
    condition: 98, // 98%
    location: "Đống Đa, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1576435728678-38d01d52e38b?auto=format&fit=crop&w=600&q=80",
    postedTime: "2 giờ trước",
    inspectorChecked: true, // Đã được kiểm định
    seller: {
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
  },
  {
    id: 2,
    name: "Giant Escape 2 City Disc",
    price: 8200000,
    originalPrice: 10500000,
    brand: "Giant",
    type: "Touring",
    condition: 95,
    location: "Q.1, TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?auto=format&fit=crop&w=600&q=80",
    postedTime: "5 giờ trước",
    inspectorChecked: true,
    seller: {
      name: "Trần Bảo B",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
  },
  {
    id: 3,
    name: "Specialized Allez E5 Sport",
    price: 21000000,
    originalPrice: 25000000,
    brand: "Specialized",
    type: "Road",
    condition: 99,
    location: "Hải Châu, Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80",
    postedTime: "1 ngày trước",
    inspectorChecked: false, // Chưa kiểm định
    seller: {
      name: "Lê C",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
  },
  {
    id: 4,
    name: "Trinx M136 Pro (2023)",
    price: 3500000,
    originalPrice: 4200000,
    brand: "Trinx",
    type: "MTB",
    condition: 90,
    location: "Thanh Xuân, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1511994298241-608e28f14fde?auto=format&fit=crop&w=600&q=80",
    postedTime: "30 phút trước",
    inspectorChecked: true,
    seller: {
      name: "Hoàng D",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
  },
  {
    id: 5,
    name: "Cannondale Trail 5",
    price: 14500000,
    originalPrice: 18000000,
    brand: "Cannondale",
    type: "MTB",
    condition: 96,
    location: "Thủ Đức, TP. HCM",
    image:
      "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&w=600&q=80",
    postedTime: "3 ngày trước",
    inspectorChecked: true,
    seller: {
      name: "Phạm E",
      avatar: "https://i.pravatar.cc/150?u=5",
    },
  },
  {
    id: 6,
    name: "Pinarello Dogma F12 (Frame Only)",
    price: 85000000,
    originalPrice: 120000000,
    brand: "Pinarello",
    type: "Road",
    condition: 99,
    location: "Q.3, TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=600&q=80",
    postedTime: "1 tuần trước",
    inspectorChecked: true,
    seller: {
      name: "Đại Gia F",
      avatar: "https://i.pravatar.cc/150?u=6",
    },
  },
  {
    id: 7,
    name: "Galaxy ML200",
    price: 2800000,
    originalPrice: 3500000,
    brand: "Galaxy",
    type: "MTB",
    condition: 85,
    location: "Cầu Giấy, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1505705693723-d3222eb61199?auto=format&fit=crop&w=600&q=80",
    postedTime: "4 giờ trước",
    inspectorChecked: false,
    seller: {
      name: "Sinh Viên G",
      avatar: "https://i.pravatar.cc/150?u=7",
    },
  },
  {
    id: 8,
    name: "Cervélo S5 Disc",
    price: 110000000,
    originalPrice: 140000000,
    brand: "Cervélo",
    type: "Road",
    condition: 97,
    location: "Tây Hồ, Hà Nội",
    image:
      "https://images.unsplash.com/photo-1559348349-86f1f65817fe?auto=format&fit=crop&w=600&q=80",
    postedTime: "2 ngày trước",
    inspectorChecked: true,
    seller: {
      name: "Hùng H",
      avatar: "https://i.pravatar.cc/150?u=8",
    },
  },
];
