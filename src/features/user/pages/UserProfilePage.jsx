import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useTransaction } from "../../../context/TransactionContext";
import { Link, useSearchParams } from "react-router-dom";
import { MOCK_BIKES } from "../../../mockData/bikes";
import { MdCameraAlt, MdVerified, MdLock } from "react-icons/md";

// Import Services
import { userService } from "../../../services/userService";
import { uploadService } from "../../../services/uploadService";

// Import Components
import ProfileSidebar from "../components/ProfileSidebar";
import UserInfoTab from "../components/UserInfoTab";
import MyBikesTab from "../components/MyBikesTab";
import TransactionManagementTab from "../components/TransactionManagementTab";
import TransactionHistoryTab from "../components/TransactionHistoryTab";
import SecurityTab from "../components/SecurityTab";

const UserProfilePage = () => {
  const { user, logout } = useAuth();
  const { transactions, sellerAcceptTransaction, sellerRejectTransaction } =
    useTransaction();

  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "info";
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true); // Thêm state loading ban đầu

  // Ref cho input file
  const fileInputRef = useRef(null);

  // Khởi tạo state với dữ liệu có sẵn từ Context (để hiển thị ngay lập tức)
  const [formData, setFormData] = useState({
    id: user?.userId || "",
    name: user?.fullName || user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
    bio: "",
    avatar: user?.avatar || "",
  });

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl) setActiveTab(tabFromUrl);
    else setActiveTab("info");
  }, [searchParams]);

  // Lấy thông tin User chi tiết từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingData(true);
      try {
        const response = await userService.getMyInfo();
        const userData = response.result;

        setFormData({
          id: userData.userId,
          name: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          address: userData.address || "",
          bio: "",
          avatar: userData.avatar || "",
        });
      } catch (error) {
        console.error("Lỗi lấy thông tin user:", error);
      } finally {
        // Tắt loading sau một khoảng ngắn để hiệu ứng mượt hơn
        setTimeout(() => setIsLoadingData(false), 300);
      }
    };

    if (user) fetchUserInfo();
  }, [user]);

  // Hàm kích hoạt input file
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // --- LOGIC UPLOAD VÀ LƯU ẢNH NGAY LẬP TỨC ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload lên Cloudinary
      const response = await uploadService.uploadImage(file);
      const imageUrl = response.result;

      // 2. Gọi API cập nhật User ngay lập tức (Gửi kèm các thông tin cũ để tránh bị null nếu backend required)
      const updatePayload = {
        fullName: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        avatar: imageUrl, // Ảnh mới
      };

      await userService.updateUser(formData.id, updatePayload);

      // 3. Cập nhật giao diện ngay lập tức
      setFormData((prev) => ({ ...prev, avatar: imageUrl }));
    } catch (error) {
      console.error("Upload avatar lỗi:", error);
      alert("Cập nhật avatar thất bại. Vui lòng thử lại.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSwitchTab = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Lưu thông tin Text (Tên, SĐT, Địa chỉ...)
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        fullName: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        avatar: formData.avatar,
      };

      await userService.updateUser(formData.id, updateData);
      alert("Cập nhật hồ sơ thành công!");
      window.location.reload();
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Cập nhật thất bại.");
    } finally {
      setIsSaving(false);
    }
  };

  const myBikes = MOCK_BIKES.slice(0, 3);

  // --- SKELETON LOADING UI (Hiển thị khi đang tải dữ liệu lần đầu) ---
  if (isLoadingData && !formData.name && !user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 font-sans flex justify-center pt-32">
        <div className="container mx-auto px-4 max-w-6xl animate-pulse">
          <div className="h-48 bg-gray-200 rounded-3xl mb-12"></div>
          <div className="flex gap-8">
            <div className="w-1/4 h-96 bg-gray-200 rounded-2xl"></div>
            <div className="w-3/4 h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white relative">
                {/* Loading khi đang upload ảnh */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-full">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <img
                  src={
                    formData.avatar ||
                    user.avatar ||
                    `https://ui-avatars.com/api/?name=${formData.name || user.name}&background=random&color=fff&background=ea580c`
                  }
                  alt="Avatar"
                  className={`w-full h-full object-cover rounded-full transition-opacity duration-300 ${isLoadingData ? "opacity-0" : "opacity-100"}`}
                  onLoad={(e) => e.target.classList.remove("opacity-0")}
                />
              </div>

              {/* Input & Button Camera */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 p-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 shadow-md cursor-pointer transition-transform hover:scale-110"
                disabled={isUploading}
              >
                <MdCameraAlt />
              </button>
            </div>

            <div className="mb-2">
              <h1 className="text-3xl font-black text-zinc-900 flex items-center gap-2">
                {formData.name || user.name}{" "}
                <MdVerified className="text-blue-500 text-xl" />
              </h1>
              <p className="text-gray-500 font-medium">Thành viên VeloX</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* SIDEBAR */}
          <div className="lg:col-span-3 space-y-6">
            <ProfileSidebar
              activeTab={activeTab}
              setActiveTab={handleSwitchTab}
              logout={logout}
            />
          </div>

          {/* CONTENT */}
          <div className="lg:col-span-9">
            <div
              className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[500px] transition-opacity duration-300 ${isLoadingData ? "opacity-60 pointer-events-none" : "opacity-100"}`}
            >
              {activeTab === "info" && (
                <UserInfoTab
                  formData={formData}
                  handleChange={handleChange}
                  onSave={handleSave}
                  loading={isSaving}
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

              {activeTab === "security" && <SecurityTab />}

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
