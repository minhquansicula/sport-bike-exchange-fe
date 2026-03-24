import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { inspectorService } from "../../../services/inspectorService";
import { uploadService } from "../../../services/uploadService";
import { toast } from "react-hot-toast";
import { useInspectorTaskDetail } from "../hooks/useInspectorTaskDetail";
import { useInspectorTasks } from "../hooks/useInspectorTasks";
import {
  MdArrowBack,
  MdSave,
  MdCheckCircle,
  MdWarning,
  MdClose,
  MdCameraAlt,
  MdPedalBike,
  MdAddAPhoto,
  MdImage,
  MdPeople,
  MdRemoveCircle,
  MdHelp,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

// Danh sách linh kiện mặc định cho xe máy thể thao
const DEFAULT_CHECKLIST = [
  { name: "Khung xe" },
  { name: "Phanh trước" },
  { name: "Phanh sau" },
  { name: "Lốp xe trước" },
  { name: "Lốp xe sau" },
  { name: "Động cơ" },
  { name: "Hộp số" },
  { name: "Đèn pha / đèn hậu" },
  { name: "Ly hợp" },
  { name: "Dầu nhớt / nhiên liệu" },
  { name: "Giảm xóc trước" },
  { name: "Giảm xóc sau" },
  { name: "Hệ thống điện" },
];

const STATUS_CONFIG = {
  PASS: {
    label: "PASS",
    bg: "bg-emerald-500",
    text: "text-white",
    ring: "ring-emerald-400",
    icon: <MdCheckCircle size={16} />,
  },
  FAIL: {
    label: "FAIL",
    bg: "bg-red-500",
    text: "text-white",
    ring: "ring-red-400",
    icon: <MdRemoveCircle size={16} />,
  },
  NOT_CHECKED: {
    label: "Chưa KT",
    bg: "bg-gray-200",
    text: "text-gray-600",
    ring: "ring-gray-300",
    icon: <MdHelp size={16} />,
  },
};

const CreateReportPage = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get("taskId");
  const navigate = useNavigate();
  const {
    task,
    loading: taskLoading,
    error: taskError,
  } = useInspectorTaskDetail(taskId, {
    enabled: Boolean(taskId),
  });
  const {
    tasks: allTasks,
    loading: listLoading,
    error: listError,
  } = useInspectorTasks({}, { enabled: !taskId });
  const loading = taskId ? taskLoading : listLoading;
  const pendingTasks = useMemo(
    () => allTasks.filter((t) => ["Scheduled", "pending"].includes(t.status)),
    [allTasks]
  );

  // Danh sách checklist linh kiện
  const [checklist, setChecklist] = useState(
    DEFAULT_CHECKLIST.map((item) => ({
      name: item.name,
      status: "NOT_CHECKED",
      note: "",
    }))
  );

  const [formData, setFormData] = useState({
    notes: "",
    issues: [],
    images: [],
  });

  const [attendance, setAttendance] = useState({
    buyerPresent: false,
    sellerPresent: false,
  });

  const [newIssue, setNewIssue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskError || listError) {
      console.error("Lỗi tải dữ liệu:", taskError || listError);
      toast.error("Không thể tải thông tin");
    }
  }, [taskError, listError]);

  // Cleanup image URLs khi unmount
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [formData.images]);

  // --- Checklist handlers ---
  const handleChecklistStatus = (index, status) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, status } : item))
    );
  };

  const handleChecklistNote = (index, note) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, note } : item))
    );
  };

  // --- Attendance ---
  const handleAttendanceChange = (role) => {
    setAttendance((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const isAttendanceComplete = attendance.buyerPresent && attendance.sellerPresent;

  // --- Image upload ---
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== files.length) {
      toast.error("Một số ảnh vượt quá 10MB, đã bỏ qua");
    }
    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  const removeImage = (imageId) => {
    const img = formData.images.find((i) => i.id === imageId);
    if (img) URL.revokeObjectURL(img.preview);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.id !== imageId),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addIssue = () => {
    if (newIssue.trim()) {
      setFormData((prev) => ({ ...prev, issues: [...prev.issues, newIssue.trim()] }));
      setNewIssue("");
    }
  };

  const removeIssue = (index) => {
    setFormData((prev) => ({
      ...prev,
      issues: prev.issues.filter((_, i) => i !== index),
    }));
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAttendanceComplete) {
      toast.error("Vui lòng xác nhận điểm danh 2 bên trước khi lưu báo cáo!");
      return;
    }
    if (!taskId) {
      toast.error("Thiếu thông tin nhiệm vụ!");
      return;
    }

    // Tự động xác định result
    const hasAnyFail = checklist.some((item) => item.status === "FAIL");
    const allPassed = checklist.every((item) => item.status === "PASS");
    const result = allPassed ? "SUCCESS" : hasAnyFail ? "FAILED" : "FAILED";

    // Ghi chú tổng hợp các issues vào reason
    const reason = formData.issues.length > 0 ? formData.issues.join("; ") : "";

    setIsSubmitting(true);
    try {
      // Upload ảnh nếu có
      const uploadedUrls = [];
      if (formData.images.length > 0) {
        for (const img of formData.images) {
          const res = await uploadService.uploadImage(img.file);
          if (res?.result) uploadedUrls.push(res.result);
        }
      }

      const payload = {
        result,
        reason,
        note: formData.notes,
        checklistItems: checklist,
      };

      await inspectorService.createInspectionReport(taskId, payload);
      toast.success("Tạo báo cáo kiểm định thành công!");
      navigate(`/inspector/tasks/${taskId}`);
    } catch (error) {
      console.error("Lỗi tạo báo cáo:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi lưu báo cáo");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- View: Selection List (if no taskId) ---
  if (!taskId) {
    return (
      <div className="max-w-4xl mx-auto pb-10">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/inspector/tasks")}
            className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 transition-colors"
          >
            <MdArrowBack size={24} className="text-gray-700" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              Chọn xe cần kiểm định
            </h1>
            <p className="text-gray-500 text-sm mt-1">Danh sách các yêu cầu đang chờ xử lý</p>
          </div>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="grid gap-4">
            {pendingTasks.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:border-emerald-200 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={t.bikeImage || "https://via.placeholder.com/150"}
                    alt="bike"
                    className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{t.bikeName}</h3>
                    <p className="text-sm text-gray-500">Mã GD: #{t.id}</p>
                    <p className="text-xs text-blue-600 mt-1 uppercase font-bold tracking-wider">
                      {new Date(t.scheduledTime).toLocaleString("vi-VN")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/inspector/create-report?taskId=${t.id}`)}
                  className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Kiểm định ngay
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <MdPedalBike className="text-emerald-500" size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có xe nào cần báo cáo</h3>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
              Tất cả các nhiệm vụ hiện tại đã được hoàn thành hoặc chưa đến giờ kiểm định.
            </p>
            <button
              onClick={() => navigate("/inspector/tasks")}
              className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
            >
              Xem nhiệm vụ khác
            </button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  // Summary stats
  const passCount = checklist.filter((i) => i.status === "PASS").length;
  const failCount = checklist.filter((i) => i.status === "FAIL").length;
  const notCheckedCount = checklist.filter((i) => i.status === "NOT_CHECKED").length;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 transition-colors"
        >
          <MdArrowBack size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Tạo báo cáo kiểm định
          </h1>
          {task && (
            <p className="text-gray-500 text-sm mt-1">
              Nhiệm vụ: {task.bikeName} - Mã #{task.id}
            </p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bike Info */}
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100/50 p-6">
          <h2 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <MdPedalBike className="text-emerald-600" /> Thông tin xe kiểm định
          </h2>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={task?.bikeImage || "https://via.placeholder.com/400"}
              alt="Bike"
              className="w-full sm:w-32 h-32 rounded-xl object-cover border-2 border-white shadow-sm"
            />
            <div className="w-full">
              <h3 className="font-black text-xl text-gray-900 mb-2">
                {task?.bikeName || "Đang tải tên xe..."}
              </h3>
              <div className="grid grid-cols-2 gap-y-1 text-sm">
                <span className="text-gray-500">Mã GD:</span>{" "}
                <span className="font-semibold">#{task?.id || taskId}</span>
                <span className="text-gray-500">Người bán:</span>{" "}
                <span className="font-medium">{task?.sellerName || task?.seller?.fullName || task?.seller?.name || "—"}</span>
                <span className="text-gray-500">Người mua:</span>{" "}
                <span className="font-medium">{task?.buyerName || task?.buyer?.fullName || task?.buyer?.name || "—"}</span>
                {task?.price && (
                  <>
                    <span className="text-gray-500">Giá trị:</span>{" "}
                    <span className="text-emerald-600 font-bold">{formatCurrency(task.price)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Điểm danh */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdPeople className="text-emerald-500" />
            Xác nhận mặt đối mặt
            {isAttendanceComplete && (
              <span className="ml-2 px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full uppercase tracking-wider">
                Đã đủ mặt
              </span>
            )}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${attendance.buyerPresent
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
            >
              <input
                type="checkbox"
                checked={attendance.buyerPresent}
                onChange={() => handleAttendanceChange("buyerPresent")}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <img
                src={task?.buyerAvatar || `https://i.pravatar.cc/150?u=${task?.buyerName || task?.buyer?.fullName || "buyer"}`}
                alt="Buyer"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Người mua</p>
                <p className="font-bold text-gray-900">{task?.buyerName || task?.buyer?.fullName || task?.buyer?.name || "Người mua"}</p>
              </div>
              {attendance.buyerPresent && <MdCheckCircle className="text-emerald-500" size={24} />}
            </label>

            <label
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${attendance.sellerPresent
                ? "border-emerald-500 bg-emerald-50/50"
                : "border-gray-100 bg-gray-50 hover:border-gray-200"
                }`}
            >
              <input
                type="checkbox"
                checked={attendance.sellerPresent}
                onChange={() => handleAttendanceChange("sellerPresent")}
                className="w-5 h-5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              />
              <img
                src={task?.sellerAvatar || `https://i.pravatar.cc/150?u=${task?.sellerName || task?.seller?.fullName || "seller"}`}
                alt="Seller"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Người bán</p>
                <p className="font-bold text-gray-900">{task?.sellerName || task?.seller?.fullName || task?.seller?.name || "Người bán"}</p>
              </div>
              {attendance.sellerPresent && <MdCheckCircle className="text-emerald-500" size={24} />}
            </label>
          </div>
          {!isAttendanceComplete && (
            <p className="mt-4 text-sm text-yellow-600 flex items-center gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100">
              <MdWarning size={18} />
              Vui lòng điểm danh đủ cả hai bên trước khi ban hành báo cáo kiểm định!
            </p>
          )}
        </div>

        {/* ===== CHECKLIST LINH KIỆN ===== */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MdCheckCircle className="text-emerald-500" />
              Checklist linh kiện
            </h2>
            {/* Summary badges */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                ✓ {passCount} PASS
              </span>
              <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                ✗ {failCount} FAIL
              </span>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                ? {notCheckedCount} Chưa KT
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {checklist.map((item, index) => (
              <div
                key={index}
                className={`rounded-xl border p-4 transition-all ${item.status === "PASS"
                  ? "border-emerald-200 bg-emerald-50/40"
                  : item.status === "FAIL"
                    ? "border-red-200 bg-red-50/40"
                    : "border-gray-100 bg-gray-50/60"
                  }`}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {/* Tên linh kiện */}
                  <span className="font-semibold text-gray-800 min-w-[130px]">
                    {item.name}
                  </span>

                  {/* Nút trạng thái */}
                  <div className="flex gap-2">
                    {Object.entries(STATUS_CONFIG).map(([statusKey, cfg]) => (
                      <button
                        key={statusKey}
                        type="button"
                        onClick={() => handleChecklistStatus(index, statusKey)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border-2 ${item.status === statusKey
                          ? `${cfg.bg} ${cfg.text} border-transparent ring-2 ${cfg.ring} shadow-sm scale-105`
                          : "bg-white border-gray-200 text-gray-400 hover:border-gray-300"
                          }`}
                      >
                        {cfg.icon}
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ghi chú — hiện luôn, nổi bật hơn khi FAIL */}
                <div className="mt-3">
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) => handleChecklistNote(index, e.target.value)}
                    placeholder={
                      item.status === "FAIL"
                        ? "Mô tả chi tiết lỗi..."
                        : "Ghi chú (tuỳ chọn)..."
                    }
                    className={`w-full text-sm px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all ${item.status === "FAIL"
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100 bg-white"
                      : "border-gray-200 focus:border-emerald-400 focus:ring-emerald-50 bg-white/70"
                      }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Cảnh báo nếu còn hạng mục chưa kiểm tra */}
          {notCheckedCount > 0 && (
            <p className="mt-4 text-sm text-amber-600 flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
              <MdWarning size={18} />
              Còn <strong>{notCheckedCount}</strong> hạng mục chưa được kiểm tra. Kết quả sẽ bị tính là FAILED.
            </p>
          )}
        </div>

        {/* Vấn đề phát hiện */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdWarning className="text-yellow-500" />
            Vấn đề phát hiện (nếu có)
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <input
              type="text"
              placeholder="VD: Xước nhẹ ở khung sườn trái..."
              value={newIssue}
              onChange={(e) => setNewIssue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addIssue())}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-50"
            />
            <button
              type="button"
              onClick={addIssue}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-700 font-bold transition-colors"
            >
              Thêm lỗi
            </button>
          </div>
          {formData.issues.length > 0 && (
            <ul className="space-y-2">
              {formData.issues.map((issue, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3.5 bg-yellow-50 border border-yellow-100 rounded-xl"
                >
                  <span className="text-sm text-yellow-800 font-medium">• {issue}</span>
                  <button
                    type="button"
                    onClick={() => removeIssue(index)}
                    className="p-1.5 bg-white text-yellow-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
                  >
                    <MdClose size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Image Upload */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <MdAddAPhoto className="text-emerald-500" />
            Thêm hình ảnh thực tế
          </h2>
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-emerald-50 hover:border-emerald-300 transition-colors mb-6 group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <MdCameraAlt className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="mb-1 text-sm text-gray-600">
                <span className="font-bold text-emerald-600">Click để tải ảnh</span>{" "}
                hoặc kéo thả vào đây
              </p>
              <p className="text-xs text-gray-400 font-medium">Hỗ trợ PNG, JPG (Tối đa 10MB)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" multiple onChange={handleImageUpload} />
          </label>
          {formData.images.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.map((image) => (
                <div key={image.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <img src={image.preview} alt={image.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                    >
                      <MdClose size={20} />
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs truncate font-medium">{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 text-sm flex flex-col items-center justify-center gap-2 border border-gray-100 rounded-xl bg-gray-50">
              <MdImage size={24} className="text-gray-300" />
              Chưa có hình ảnh nào được thêm
            </div>
          )}
        </div>

        {/* Ghi chú inspector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ghi chú riêng của Inspector</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Nhập ghi chú ẩn rủi ro, nhận xét chuyên môn về xe (Người dùng sẽ không thấy phần này)..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 resize-none bg-gray-50"
          />
        </div>

        {/* Sticky Footer */}
        <div className="flex items-center justify-between gap-3 pt-4 sticky bottom-0 bg-gray-50 py-4 border-t border-gray-200 z-10 -mx-4 px-4 md:mx-0 md:px-0">
          {/* Result preview */}
          <div className="text-sm font-semibold">
            Kết quả dự kiến:{" "}
            {checklist.every((i) => i.status === "PASS") ? (
              <span className="text-emerald-600">✓ SUCCESS (Đạt)</span>
            ) : (
              <span className="text-red-500">✗ FAILED (Không đạt)</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition-colors shadow-sm"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isAttendanceComplete}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${isAttendanceComplete && !isSubmitting
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 hover:shadow-emerald-300 active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Đang lưu...
                </>
              ) : (
                <>
                  <MdSave size={20} /> Ban hành chứng nhận
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateReportPage;
