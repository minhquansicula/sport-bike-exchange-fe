// src/mockData/bikes.js

export const MOCK_BIKES = [
  {
    id: 1,
    name: "Trek Marlin 7 Gen 2 (2022)",
    price: 12500000,
    originalPrice: 15500000,
    brand: "Trek",
    type: "MTB",
    condition: 98,
    location: "Đống Đa, Hà Nội",
    image:
      "https://fxbike.vn/wp-content/uploads/2022/02/Trek-Marlin-7-2022-1-600x450.jpeg",
    postedTime: "2 giờ trước",
    inspectorChecked: true,
    seller: {
      name: "Nguyễn Văn A",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    // 👇 THÔNG TIN BỔ SUNG
    year: 2022,
    frame: "M",
    wheel: "29 inch",
    brake: "Phanh đĩa dầu Shimano MT200",
    gears: "1x10 Shimano Deore",
    weight: 13.5,
    description:
      "Xe MTB quốc dân, màu xanh cực đẹp. Phù hợp người cao 1m65-1m75. Đã nâng cấp pedal bạc đạn và grip êm tay.",
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
    // 👇 THÔNG TIN BỔ SUNG
    year: 2021,
    frame: "S",
    wheel: "700c",
    brake: "Phanh đĩa cơ Tektro",
    gears: "2x8 Shimano Altus",
    weight: 11.2,
    description:
      "Dòng touring đi phố nhẹ nhàng, có baga chắn bùn zin theo xe. Xe chính chủ đi làm hàng ngày, bảo dưỡng định kỳ.",
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
    inspectorChecked: false,
    seller: {
      name: "Lê C",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    // 👇 THÔNG TIN BỔ SUNG
    year: 2020,
    frame: "52",
    wheel: "700c",
    brake: "Phanh vành Axis",
    gears: "2x9 Shimano Sora",
    weight: 9.5,
    description:
      "Khung nhôm E5 cao cấp của Specialized, phuộc carbon. Xe còn rất mới, chưa đâm đụng, sơn zin nguyên bản.",
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
    // 👇 THÔNG TIN BỔ SUNG
    year: 2023,
    frame: "17 inch",
    wheel: "26 inch",
    brake: "Phanh đĩa cơ",
    gears: "3x7 Shimano Tourney",
    weight: 14.5,
    description:
      "Xe giá rẻ cho học sinh sinh viên, cấu hình đủ dùng đi học, đi chơi. Có xước dăm nhẹ ở khung do gửi xe.",
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
    // 👇 THÔNG TIN BỔ SUNG
    year: 2021,
    frame: "L",
    wheel: "29 inch",
    brake: "Phanh đĩa dầu Tektro",
    gears: "2x10 Shimano Deore",
    weight: 13.8,
    description:
      "Thương hiệu Mỹ, khung sườn bảo hành trọn đời. Màu xám xi măng hot trend. Phuộc nhún êm ái.",
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
      "https://pinarello.com/storage/Article/c43ba97463a91e8215b71d134aed6184.jpg",
    postedTime: "1 tuần trước",
    inspectorChecked: true,
    seller: {
      name: "Đại Gia F",
      avatar: "https://i.pravatar.cc/150?u=6",
    },
    // 👇 THÔNG TIN BỔ SUNG
    year: 2020,
    frame: "50",
    wheel: "700c (Tương thích)",
    brake: "Phanh vành (Direct Mount)",
    gears: "N/A",
    weight: 0.8, // Frame weight
    description:
      "Chỉ bán khung sườn (Frame set) Dogma F12 hàng chính hãng, bao check serial. Kèm cọc yên, ghi đông Most Talon.",
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
      "https://fxbike.vn/wp-content/uploads/2023/10/Xe-Dap-Galaxy-ML200-2024-2-3.jpg",
    postedTime: "4 giờ trước",
    inspectorChecked: false,
    seller: {
      name: "Sinh Viên G",
      avatar: "https://i.pravatar.cc/150?u=7",
    },
    // 👇 THÔNG TIN BỔ SUNG
    year: 2022,
    frame: "17 inch",
    wheel: "26 inch",
    brake: "Phanh đĩa cơ",
    gears: "3x8 Shimano",
    weight: 15.0,
    description:
      "Xe đạp thể thao giá rẻ, khung nhôm, phù hợp tập thể dục nhẹ nhàng. Lốp sau hơi mòn.",
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
    // 👇 THÔNG TIN BỔ SUNG
    year: 2023,
    frame: "54",
    wheel: "700c",
    brake: "Phanh đĩa dầu Dura-Ace",
    gears: "2x12 Shimano Dura-Ace Di2",
    weight: 7.8,
    description:
      "Siêu phẩm Aero, group điện cao cấp nhất. Xe như mới khui thùng, chủ cũ đi cafe là chính.",
  },
];
