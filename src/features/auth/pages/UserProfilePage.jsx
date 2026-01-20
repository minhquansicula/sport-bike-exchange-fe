import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useTransaction } from "../../../context/TransactionContext";
import { Link, useSearchParams } from "react-router-dom";
import { MOCK_BIKES } from "../../../mockData/bikes";

// Import Icons
import {
  MdPerson,
  MdLock,
  MdNotifications,
  MdCameraAlt,
  MdVerified,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSave,
  MdHistory,
  MdLogout,
  MdPedalBike,
  MdCheckCircle,
  MdAccessTime,
  MdAdminPanelSettings,
  MdMap,
  MdCancel,
  MdInfoOutline,
  MdReceiptLong,
} from "react-icons/md";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const { transactions, sellerAcceptTransaction, sellerRejectTransaction } =
    useTransaction();

  // --- 1. LOGIC ĐỌC TAB TỪ URL ---
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Đồng bộ URL với Tab
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // --- 2. QUẢN LÝ FORM ---
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 3. HELPER UI ---
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending_seller":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdAccessTime /> Chờ xác nhận
          </span>
        );
      case "pending_admin":
        return (
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdAdminPanelSettings /> Chờ xếp lịch
          </span>
        );
      case "scheduled":
        return (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <MdCheckCircle /> Đã lên lịch
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
            Đã hủy/Từ chối
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
            Hoàn tất
          </span>
        );
    }
  };

  const myBikes = MOCK_BIKES.slice(0, 3);

  // --- 4. XỬ LÝ KHI CHƯA ĐĂNG NHẬP (FIX LỖI CỦA BẠN) ---
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <MdLock size={40} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Vui lòng đăng nhập để quản lý hồ sơ, xe đạp và các giao dịch của bạn
            tại OldBike.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-200"
            >
              Đăng nhập ngay
            </Link>
            <Link
              to="/"
              className="block w-full text-sm font-bold text-gray-400 hover:text-zinc-800 transition-colors py-2"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. GIAO DIỆN CHÍNH (KHI ĐÃ LOGIN) ---
  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* HEADER PROFILE */}
        <div className="relative mb-24">
          <div className="h-48 w-full bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>
          <div className="absolute -bottom-16 left-8 flex items-end gap-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${user.name}`
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 shadow-md cursor-pointer transition-transform hover:scale-110">
                <MdCameraAlt />
              </button>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-2">
                {user.name} <MdVerified className="text-blue-500 text-xl" />
              </h1>
              <p className="text-gray-500 font-medium">Thành viên OldBike</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR MENU */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <nav className="flex flex-col p-2 space-y-1">
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Tài khoản
                </p>
                <button
                  onClick={() => setActiveTab("info")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "info" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdPerson size={20} /> Thông tin cá nhân
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "security" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdLock size={20} /> Bảo mật tài khoản
                </button>
                <button
                  onClick={() => setActiveTab("notification")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "notification" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdNotifications size={20} /> Cài đặt thông báo
                </button>

                <div className="h-px bg-gray-100 my-2"></div>
                <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Quản lý
                </p>
                <button
                  onClick={() => setActiveTab("my-bikes")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "my-bikes" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdPedalBike size={20} /> Xe của tôi
                </button>
                <button
                  onClick={() => setActiveTab("transactions")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === "transactions" ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}
                >
                  <MdHistory size={20} /> Lịch sử giao dịch
                </button>

                <div className="h-px bg-gray-100 my-2"></div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-50"
                >
                  <MdLogout size={20} /> Đăng xuất
                </button>
              </nav>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              {/* TAB 1: THÔNG TIN */}
              {activeTab === "info" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
                    Hồ sơ của tôi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Email
                      </label>
                      <input
                        type="text"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-100 border rounded-xl text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        SĐT
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Địa chỉ
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-zinc-700">
                        Bio
                      </label>
                      <textarea
                        rows="3"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full p-4 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-orange-100 resize-none transition-all"
                      ></textarea>
                    </div>
                    <button className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm mt-4 w-fit hover:bg-orange-600 transition-colors shadow-lg">
                      <MdSave className="inline mr-2" /> Lưu thay đổi
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 2: BẢO MẬT */}
              {activeTab === "security" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
                    Bảo mật
                  </h2>
                  <p className="text-gray-500 italic">
                    Chức năng đổi mật khẩu đang được bảo trì.
                  </p>
                </div>
              )}

              {/* TAB 3: THÔNG BÁO */}
              {activeTab === "notification" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
                    Thông báo
                  </h2>
                  <div className="space-y-4">
                    {[
                      "Thông báo khi có giao dịch",
                      "Thông báo khuyến mãi",
                      "Nhận Email hàng tuần",
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <span className="text-zinc-700 font-medium">
                          {item}
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: XE CỦA TÔI */}
              {activeTab === "my-bikes" && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-zinc-900">
                      Kho xe của tôi
                    </h2>
                    <Link
                      to="/post-bike"
                      className="bg-zinc-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all shadow-md"
                    >
                      + Đăng tin mới
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myBikes.map((bike) => (
                      <div
                        key={bike.id}
                        className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="aspect-[16/10] bg-gray-100 rounded-xl overflow-hidden mb-4 relative">
                          <img
                            src={bike.image}
                            alt={bike.name}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                            Đang hiển thị
                          </span>
                        </div>
                        <h3 className="font-bold text-zinc-900 line-clamp-1 mb-1">
                          {bike.name}
                        </h3>
                        <p className="text-orange-600 font-bold mb-4">
                          {bike.price.toLocaleString("vi-VN")} đ
                        </p>
                        <div className="flex gap-2">
                          <button className="flex-1 bg-gray-50 hover:bg-gray-200 text-zinc-700 py-2 rounded-lg text-sm font-bold transition-colors">
                            Sửa
                          </button>
                          <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-bold transition-colors">
                            Gỡ tin
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: LỊCH SỬ GIAO DỊCH */}
              {activeTab === "transactions" && (
                <div className="animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100">
                    <div>
                      <h2 className="text-2xl font-bold text-zinc-900">
                        Lịch sử giao dịch
                      </h2>
                      <p className="text-gray-500 text-sm">
                        Theo dõi tiến trình mua bán của bạn
                      </p>
                    </div>
                  </div>

                  {transactions.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                      <MdReceiptLong
                        className="mx-auto text-gray-300 mb-3"
                        size={48}
                      />
                      <p className="text-gray-500">Chưa có giao dịch nào.</p>
                      <Link
                        to="/bikes"
                        className="text-orange-600 font-bold text-sm hover:underline mt-2 inline-block"
                      >
                        Đi xem xe ngay
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {transactions.map((t) => (
                        <div
                          key={t.id}
                          className="border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all"
                        >
                          {/* 1. Header Card */}
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex gap-4">
                              <img
                                src={t.image}
                                alt=""
                                className="w-20 h-20 rounded-xl object-cover bg-gray-100 border border-gray-100"
                              />
                              <div>
                                <p className="font-bold text-lg text-zinc-900">
                                  {t.bikeName}
                                </p>
                                <p className="text-orange-600 font-bold">
                                  {t.price.toLocaleString("vi-VN")} đ
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                  <span>Mã GD: #{t.id}</span> •{" "}
                                  <span>
                                    {new Date(t.createdAt).toLocaleDateString()}
                                  </span>
                                </p>
                              </div>
                            </div>
                            {renderStatusBadge(t.status)}
                          </div>

                          <div className="h-px bg-gray-100 my-4"></div>

                          {/* 2. ACTIONS AREA */}

                          {/* STATUS: PENDING SELLER */}
                          {t.status === "pending_seller" && (
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                              <p className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                                <MdInfoOutline /> Yêu cầu đang chờ xác nhận:
                              </p>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => sellerAcceptTransaction(t.id)}
                                  className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-600 transition-colors shadow-md"
                                >
                                  ✓ Chấp nhận bán
                                </button>
                                <button
                                  onClick={() => sellerRejectTransaction(t.id)}
                                  className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100"
                                >
                                  ✕ Từ chối
                                </button>
                              </div>
                            </div>
                          )}

                          {/* STATUS: PENDING ADMIN */}
                          {t.status === "pending_admin" && (
                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-full text-blue-600 mt-1">
                                <MdAdminPanelSettings size={20} />
                              </div>
                              <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">
                                  Đang chờ Ban Quản Trị xếp lịch
                                </h4>
                                <p className="text-sm text-blue-800/80 leading-relaxed">
                                  Chúng tôi đang sắp xếp Inspector và địa điểm
                                  phù hợp. Bạn sẽ nhận được "Vé mời giao dịch"
                                  trong vòng <strong>24h làm việc</strong>.
                                </p>
                              </div>
                            </div>
                          )}

                          {/* STATUS: SCHEDULED */}
                          {t.status === "scheduled" && (
                            <div className="bg-green-50 p-5 rounded-xl border border-green-200 relative overflow-hidden">
                              <div className="absolute top-0 right-0 p-4 opacity-10">
                                <MdCheckCircle
                                  size={100}
                                  className="text-green-500"
                                />
                              </div>
                              <h4 className="font-bold text-green-800 mb-4 flex items-center gap-2 text-lg">
                                <MdReceiptLong /> VÉ MỜI GIAO DỊCH
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                <div>
                                  <p className="text-xs font-bold text-green-600 uppercase mb-1">
                                    Thời gian
                                  </p>
                                  <p className="text-zinc-900 font-medium flex items-center gap-2">
                                    <MdAccessTime className="text-orange-600" />
                                    {new Date(t.meetingTime).toLocaleString(
                                      "vi-VN",
                                      {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      },
                                    )}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-green-600 uppercase mb-1">
                                    Địa điểm
                                  </p>
                                  <p className="text-zinc-900 font-medium flex items-center gap-2">
                                    <MdMap className="text-orange-600" />{" "}
                                    {t.meetingLocation}
                                  </p>
                                </div>
                                <div className="md:col-span-2 bg-white/60 p-3 rounded-lg border border-green-100">
                                  <p className="text-xs font-bold text-green-600 uppercase mb-1">
                                    Inspector phụ trách
                                  </p>
                                  <p className="text-zinc-900 font-medium flex items-center gap-2">
                                    <MdAdminPanelSettings className="text-blue-600" />{" "}
                                    {t.inspectorName}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-4 pt-4 border-t border-green-200 flex justify-end gap-3">
                                <button className="text-red-500 text-sm font-bold hover:underline flex items-center gap-1">
                                  <MdCancel /> Hủy hẹn
                                </button>
                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-green-700">
                                  Liên hệ hỗ trợ
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
