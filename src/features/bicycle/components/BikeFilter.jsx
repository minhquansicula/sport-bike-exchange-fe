import React from "react";
import { MdFilterList, MdRefresh } from "react-icons/md";

const BikeFilter = ({ filters, setFilters, onReset }) => {
  // Xử lý khi thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý chọn nhanh (Hãng, Loại)
  const handleSelect = (category, value) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? "" : value, // Nếu chọn lại cái đang chọn thì bỏ chọn
    }));
  };

  const BRANDS = [
    "Trek",
    "Giant",
    "Specialized",
    "Cannondale",
    "Pinarello",
    "Trinx",
    "Galaxy",
  ];
  const TYPES = ["Road", "MTB", "Touring", "Fixed Gear"];

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-zinc-900 flex items-center gap-2">
          <MdFilterList className="text-orange-600" /> Bộ Lọc
        </h3>
        <button
          onClick={onReset}
          className="text-xs text-gray-400 hover:text-orange-600 flex items-center gap-1 transition-colors"
        >
          <MdRefresh /> Đặt lại
        </button>
      </div>

      {/* --- 1. LỌC THEO TÊN (Search) --- */}
      <div className="mb-6">
        <label className="text-sm font-bold text-zinc-800 mb-2 block">
          Tìm tên xe
        </label>
        <input
          type="text"
          name="search"
          value={filters.search}
          onChange={handleChange}
          placeholder="Ví dụ: Trek Marlin..."
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 outline-none transition-all"
        />
      </div>

      {/* --- 2. KHOẢNG GIÁ --- */}
      <div className="mb-6">
        <label className="text-sm font-bold text-zinc-800 mb-2 block">
          Khoảng giá (VNĐ)
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="Từ"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
          />
          <span className="text-gray-400">-</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="Đến"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* --- 3. LOẠI XE --- */}
      <div className="mb-6">
        <label className="text-sm font-bold text-zinc-800 mb-2 block">
          Loại xe
        </label>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((type) => (
            <button
              key={type}
              onClick={() => handleSelect("type", type)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all
                ${
                  filters.type === type
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* --- 4. THƯƠNG HIỆU --- */}
      <div className="mb-6">
        <label className="text-sm font-bold text-zinc-800 mb-2 block">
          Thương hiệu
        </label>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="brand"
                checked={filters.brand === brand}
                onChange={() => handleSelect("brand", brand)}
                onClick={(e) => {
                  if (filters.brand === brand) {
                    setFilters((prev) => ({ ...prev, brand: "" }));
                    e.target.checked = false;
                  }
                }} // Mẹo để click lần 2 thì bỏ chọn radio
                className="accent-orange-600 w-4 h-4 cursor-pointer"
              />
              <span
                className={`text-sm group-hover:text-orange-600 transition-colors ${filters.brand === brand ? "font-bold text-zinc-900" : "text-gray-600"}`}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* --- 5. ĐỊA ĐIỂM --- */}
      <div>
        <label className="text-sm font-bold text-zinc-800 mb-2 block">
          Khu vực
        </label>
        <select
          name="location"
          value={filters.location}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:border-orange-500 outline-none cursor-pointer"
        >
          <option value="">Toàn quốc</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
        </select>
      </div>
    </div>
  );
};

export default BikeFilter;
