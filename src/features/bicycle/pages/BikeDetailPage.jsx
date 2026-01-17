import React from "react";
import { useParams } from "react-router-dom";
import { MOCK_BIKES } from "../../../mockData/bikes";
import formatCurrency from "../../../utils/formatCurrency";

const BikeDetailPage = () => {
  const { id } = useParams();

  // Tìm xe trong mock data (hoặc lấy xe đầu tiên nếu không tìm thấy để test)
  const bike = MOCK_BIKES.find((b) => b.id === Number(id)) || MOCK_BIKES[0];

  if (!bike) return <div>Không tìm thấy xe</div>;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6">
          Trang chủ / Mua xe /{" "}
          <span className="text-secondary font-medium">{bike.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: ẢNH XE */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl overflow-hidden border shadow-sm aspect-video flex items-center justify-center bg-gray-100">
              <img
                src={bike.image}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* CỘT PHẢI: GIÁ & MUA */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-xl border shadow-md sticky top-24">
              <h1 className="text-2xl font-bold text-secondary mb-2">
                {bike.name}
              </h1>
              <div className="mb-6">
                <span className="text-3xl font-bold text-primary block">
                  {formatCurrency(bike.price)}
                </span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">
                Đặt Cọc Ngay (10%)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- QUAN TRỌNG: DÒNG NÀY ĐANG BỊ THIẾU ---
export default BikeDetailPage;
