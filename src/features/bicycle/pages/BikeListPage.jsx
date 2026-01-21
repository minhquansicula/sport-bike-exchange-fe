import React, { useState, useEffect, useMemo } from "react";
import { MOCK_BIKES } from "../../../mockData/bikes";
import BikeCard from "../components/BikeCard";
import BikeFilter from "../components/BikeFilter";
import {
  MdSort,
  MdSearchOff,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";
import { useSearchParams } from "react-router-dom";

const BikeListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --- 1. CONFIG PHÂN TRANG ---
  const ITEMS_PER_PAGE = 12;
  const [currentPage, setCurrentPage] = useState(1);

  // State lưu bộ lọc
  const [filters, setFilters] = useState({
    search: "",
    minPrice: "",
    maxPrice: "",
    type: "",
    brand: "",
    location: "",
  });

  useEffect(() => {
    const querySearch = searchParams.get("search");
    if (querySearch) {
      setFilters((prev) => ({ ...prev, search: querySearch }));
    }
  }, [searchParams]);

  // State sắp xếp
  const [sortOrder, setSortOrder] = useState("newest");

  // --- 2. LOGIC LỌC & SẮP XẾP DỮ LIỆU (Giữ nguyên của bạn) ---
  const filteredBikes = useMemo(() => {
    return MOCK_BIKES.filter((bike) => {
      if (
        filters.search &&
        !bike.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false;
      if (filters.minPrice && bike.price < Number(filters.minPrice))
        return false;
      if (filters.maxPrice && bike.price > Number(filters.maxPrice))
        return false;
      if (filters.type && bike.type !== filters.type) return false;
      if (filters.brand && bike.brand !== filters.brand) return false;
      if (filters.location && !bike.location.includes(filters.location))
        return false;
      return true;
    }).sort((a, b) => {
      switch (sortOrder) {
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        default:
          return b.id - a.id;
      }
    });
  }, [filters, sortOrder]);

  // --- 3. LOGIC CẮT TRANG (MỚI THÊM) ---
  // Mỗi khi filter thay đổi, reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOrder]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentBikes = filteredBikes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBikes.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReset = () => {
    setFilters({
      search: "",
      minPrice: "",
      maxPrice: "",
      type: "",
      brand: "",
      location: "",
    });
    setSortOrder("newest");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4">
        {/* Header trang */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900">Mua xe đạp cũ</h1>
            <p className="text-gray-500 mt-1">
              Hiển thị {filteredBikes.length} kết quả phù hợp.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-gray-100 shadow-sm">
            <MdSort className="text-gray-400" size={20} />
            <span className="text-sm font-bold text-zinc-700">Sắp xếp:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="bg-transparent text-sm font-medium outline-none cursor-pointer text-orange-600"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* CỘT TRÁI: BỘ LỌC */}
          <div className="hidden lg:block lg:col-span-1">
            <BikeFilter
              filters={filters}
              setFilters={setFilters}
              onReset={handleReset}
            />
          </div>

          {/* CỘT PHẢI: DANH SÁCH XE */}
          <div className="lg:col-span-3">
            {currentBikes.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {/* Render danh sách đã cắt trang (currentBikes) thay vì toàn bộ (filteredBikes) */}
                  {currentBikes.map((bike) => (
                    <BikeCard key={bike.id} bike={bike} />
                  ))}
                </div>

                {/* --- UI PHÂN TRANG --- */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-12">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <MdChevronLeft size={24} />
                    </button>

                    {Array.from({ length: totalPages }, (_, index) => (
                      <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${
                          currentPage === index + 1
                            ? "bg-zinc-900 text-white shadow-lg shadow-gray-300"
                            : "bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200"
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                      <MdChevronRight size={24} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="bg-white rounded-2xl p-12 text-center border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <MdSearchOff size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2">
                  Không tìm thấy xe nào
                </h3>
                <p className="text-gray-500 mb-6">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn.
                </p>
                <button
                  onClick={handleReset}
                  className="bg-zinc-900 text-white px-6 py-2.5 rounded-full font-bold hover:bg-orange-600 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BikeListPage;
