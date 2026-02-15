import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useTransaction } from "../../../context/TransactionContext";
import { Link, useSearchParams } from "react-router-dom";
import { MOCK_BIKES } from "../../../mockData/bikes";
import { MdCameraAlt, MdVerified, MdLock } from "react-icons/md";

// 👇 IMPORT SERVICE ĐỂ GỌI API
import { userService } from "../../../services/userService";

// Import các thành phần con
import ProfileSidebar from "../components/ProfileSidebar";
import UserInfoTab from "../components/UserInfoTab";
import MyBikesTab from "../components/MyBikesTab";
import TransactionManagementTab from "../components/TransactionManagementTab";
import TransactionHistoryTab from "../components/TransactionHistoryTab";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const { transactions, sellerAcceptTransaction, sellerRejectTransaction } =
    useTransaction();

  // 1. Lấy hook để đọc và ghi URL params
  const [searchParams, setSearchParams] = useSearchParams();

  // Lấy tab từ URL, nếu không có thì mặc định là 'info'
  const initialTab = searchParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  // Thêm state loading cho nút Save
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    id: "", // Cần ID để gọi API update
    name: "",
    email: "",
    phone: "",
    address: "", // Trường địa chỉ từ DB
    bio: "",
  });

  // 2. Sync URL -> Tab State
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    } else {
      setActiveTab("info");
    }
  }, [searchParams]);

  // 👇 LOGIC MỚI: Gọi API lấy thông tin thật từ Backend (thay thế logic lấy từ local storage cũ)
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userService.getMyInfo();
        const userData = response.result;

        // Map dữ liệu từ Backend vào Form
        setFormData({
          id: userData.id,
          name: userData.fullName || "", // Backend trả về fullName -> Frontend dùng name
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "", // Lấy địa chỉ từ DB
          bio: userData.bio || "",
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      }
    };

    // Chỉ gọi khi có user (đã đăng nhập)
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  // 3. Hàm chuyển tab
  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 LOGIC MỚI: Hàm lưu dữ liệu
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Chuẩn bị object để gửi lên Backend
      const updateData = {
        fullName: formData.name, // Backend cần field fullName
        phone: formData.phone,
        address: formData.address,
        // bio: formData.bio // Mở comment nếu backend đã hỗ trợ bio
      };

      await userService.updateUser(formData.id, updateData);
      alert("Cập nhật hồ sơ thành công!");
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const myBikes = MOCK_BIKES.slice(0, 3);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans px-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full border border-gray-100">
          <div className="w-20 h-20 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <MdLock size={40} />
          </div>
          <h2 className="text-2xl font-black text-zinc-900 mb-3">
            Yêu cầu đăng nhập
          </h2>
          <p className="text-gray-500 mb-8">
            Vui lòng đăng nhập để quản lý hồ sơ tại OldBike.
          </p>
          <div className="space-y-3">
            <Link
              to="/login"
              className="block w-full bg-zinc-900 text-white px-8 py-3.5 rounded-xl font-bold hover:bg-orange-600 transition-all"
            >
              Đăng nhập ngay
            </Link>
            <Link
              to="/"
              className="block w-full text-sm font-bold text-gray-400 hover:text-zinc-800"
            >
              Quay về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- HEADER PROFILE --- */}
        <div className="relative mb-32">
          <div className="h-48 w-full bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
          </div>

          <div className="absolute -bottom-20 left-8 flex items-end gap-6">
            <div className="relative group mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <img
                  src={
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${formData.name || user.name}`
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
                {formData.name || user.name}{" "}
                <MdVerified className="text-blue-500 text-xl" />
              </h1>
              <p className="text-gray-500 font-medium">Thành viên OldBike</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR MENU */}
          <div className="lg:col-span-3 space-y-6">
            <ProfileSidebar
              activeTab={activeTab}
              setActiveTab={handleSwitchTab}
              logout={logout}
            />
          </div>

          {/* CONTENT AREA */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              {activeTab === "info" && (
                <UserInfoTab
                  formData={formData}
                  handleChange={handleChange}
                  onSave={handleSave} // Truyền hàm lưu xuống component con
                  loading={isSaving} // Truyền trạng thái loading
                />
              )}

              {activeTab === "my-bikes" && <MyBikesTab myBikes={myBikes} />}

              {activeTab === "transaction-manage" && (
                <TransactionManagementTab
                  transactions={transactions}
                  sellerAcceptTransaction={sellerAcceptTransaction}
                  sellerRejectTransaction={sellerRejectTransaction}
                />
              )}

              {activeTab === "transactions-history" && (
                <TransactionHistoryTab transactions={transactions} />
              )}

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

              {activeTab === "notification" && (
                <div className="animate-in fade-in duration-300">
                  <h2 className="text-2xl font-bold text-zinc-900 mb-6 pb-4 border-b border-gray-100">
                    Thông báo
                  </h2>
                  <p className="text-gray-500">Chưa có thông báo mới.</p>
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
