import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { uploadService } from "../../../services/uploadService";
import { useInspectorTasks } from "../hooks/useInspectorTasks";
import { toast } from "react-hot-toast";
import {
  MdCameraAlt,
  MdVerified,
  MdSave,
  MdPerson,
  MdEmail,
  MdWork,
  MdStar,
  MdCheckCircle,
  MdAssignment,
} from "react-icons/md";

const InspectorProfilePage = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef();
  const { tasks, loading: tasksLoading } = useInspectorTasks();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.fullName || user.name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadImage(file);
      const avatarUrl = res.result;
      await inspectorService.updateProfile({ avatar: avatarUrl });
      updateUser({ avatar: avatarUrl });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch (error) {
      toast.error("Cập nhật avatar thất bại");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success("Cập nhật thông tin thành công!");
  };

  // Tính toán thống kê từ dữ liệu thực
  const stats = useMemo(() => {
    const doneStatuses = [
      "completed",
      "waiting_payment",
      "inspection_failed",
      "cancelled",
    ];
    const doneTasks = tasks.filter((t) =>
      doneStatuses.includes(t.status?.toLowerCase()),
    );
    const totalTasks = doneTasks.length;
    const completedTasks = doneTasks.filter(
      (t) => t.status?.toLowerCase() === "completed",
    ).length;
    const completionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tính đánh giá trung bình (giả sử từ rating field, hoặc mặc định 4.9 nếu không có)
    const avgRating =
      tasks.length > 0
        ? (
            tasks.reduce((sum, t) => sum + (t.rating || 5), 0) / tasks.length
          ).toFixed(1)
        : "4.9";

    return [
      {
        label: "Tổng kiểm định",
        value: totalTasks,
        icon: <MdAssignment size={20} />,
      },
      { label: "Đánh giá", value: avgRating, icon: <MdStar size={20} /> },
      {
        label: "Hoàn thành",
        value: `${completionRate}%`,
        icon: <MdCheckCircle size={20} />,
      },
    ];
  }, [tasks]);

  // Lấy lịch sử công việc gần đây (những task đã hoàn thành, sắp xếp theo ngày mới nhất)
  const recentWorkHistory = useMemo(() => {
    return tasks
      .filter((t) => t.status?.toLowerCase() === "completed")
      .sort(
        (a, b) =>
          new Date(b.scheduledTime || b.completedTime || 0) -
          new Date(a.scheduledTime || a.completedTime || 0),
      )
      .slice(0, 6)
      .map((task) => ({
        id: task.id,
        bike: task.bikeName || task.bicycleName || "Xe đạp VeloX",
        date: task.scheduledTime
          ? new Date(task.scheduledTime).toLocaleDateString("vi-VN")
          : "Chưa cập nhật",
        result:
          task.status?.toLowerCase() === "completed"
            ? "Đạt"
            : "Không đạt",
      }));
  }, [tasks]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Profile Card */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-28 h-28 rounded-full border-4 border-white/30 shadow-xl overflow-hidden bg-white">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${user.name}&background=10B981&color=fff`
                }
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={handleAvatarClick}
              disabled={isUploading}
              className="absolute bottom-1 right-1 p-2 bg-white text-emerald-600 rounded-full hover:bg-emerald-50 shadow-lg cursor-pointer transition-transform hover:scale-110 disabled:opacity-50"
            >
              <MdCameraAlt size={16} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Info */}
          <div className="text-center md:text-left flex-1">
            <h1 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
              {user.name}
              <MdVerified className="text-emerald-300" size={22} />
            </h1>
            <p className="text-emerald-200 font-medium flex items-center justify-center md:justify-start gap-2 mt-1">
              <MdWork size={16} /> Inspector
            </p>
            <p className="text-emerald-100 text-sm mt-2 max-w-md">
              Chuyên gia kiểm định xe đạp tại OldBike
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center text-emerald-300 mb-1">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-emerald-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MdPerson className="text-emerald-500" />
            Thông tin cá nhân
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
              >
                <MdSave size={16} /> Lưu
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdPerson className="text-gray-400" /> Họ và tên
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full px-4 py-2.5 border rounded-lg transition-colors ${
                isEditing
                  ? "border-gray-200 focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-50"
                  : "border-transparent bg-gray-50 text-gray-700"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <MdEmail className="text-gray-400" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={true}
              className="w-full px-4 py-2.5 border border-transparent bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
            />
            <p className="text-xs text-gray-400 mt-1">
              Email không thể thay đổi
            </p>
          </div>

        </div>
      </div>

      {/* Work History */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-6">
          <MdAssignment className="text-emerald-500" />
          Lịch sử công việc gần đây
        </h2>

        {tasksLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-emerald-200 border-t-emerald-600"></div>
          </div>
        ) : recentWorkHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <MdAssignment size={32} className="mx-auto mb-2 text-gray-300" />
            <p>Chưa có công việc hoàn thành</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentWorkHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{item.bike}</p>
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.result === "Đạt"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.result}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InspectorProfilePage;
