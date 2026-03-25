import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { inspectorService } from "../../../services/inspectorService";
import { uploadService } from "../../../services/uploadService";
import { toast } from "react-hot-toast";
import { useInspectorTaskDetail } from "../hooks/useInspectorTaskDetail";
import { useInspectorTasks } from "../hooks/useInspectorTasks";
<<<<<<< HEAD
import { getPartyInfo } from "../../../utils/getPartyInfo";
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
=======
import { MdArrowBack, MdPedalBike } from "react-icons/md";
>>>>>>> b82d124dcdc72f3d14468d7a859d4c6d31af20c6
import formatCurrency from "../../../utils/formatCurrency";
import { useCreateReportForm } from "../hooks/useCreateReportForm";
import TaskSelectorList from "../components/create-report/TaskSelectorList";
import AttendanceSection from "../components/create-report/AttendanceSection";
import ChecklistSection from "../components/create-report/ChecklistSection";
import IssuesSection from "../components/create-report/IssuesSection";
import ImageUploadSection from "../components/create-report/ImageUploadSection";
import StickySubmitBar from "../components/create-report/StickySubmitBar";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    checklist,
    formData,
    attendance,
    newIssue,
    setNewIssue,
    handleChecklistStatus,
    handleChecklistNote,
    handleAttendanceChange,
    handleImageUpload,
    removeImage,
    setNotes,
    addIssue,
    removeIssue,
    isAttendanceComplete,
    isSomeonePresent,
    expectedResult,
    passCount,
    failCount,
    notCheckedCount,
  } = useCreateReportForm();

  useEffect(() => {
    if (taskError || listError) {
      console.error("Lỗi tải dữ liệu:", taskError || listError);
      toast.error("Không thể tải thông tin");
    }
  }, [taskError, listError]);

<<<<<<< HEAD
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
  const isSomeonePresent = attendance.buyerPresent || attendance.sellerPresent;
  // Checklist phải được kiểm tra đầy đủ khi cả 2 bên đều có mặt
  const isChecklistComplete = checklist.every((item) => item.status !== "NOT_CHECKED");
  // Chỉ yêu cầu checklist đầy đủ khi cả hai bên có mặt (trường hợp 1 bên vắng sẽ tự động hủy)
  const canSubmit = isSomeonePresent && (isAttendanceComplete ? isChecklistComplete : true);

  // --- Image upload ---
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);
    if (validFiles.length !== files.length) {
=======
  const onImageUpload = (event) => {
    const { skippedCount } = handleImageUpload(event);
    if (skippedCount > 0) {
>>>>>>> b82d124dcdc72f3d14468d7a859d4c6d31af20c6
      toast.error("Một số ảnh vượt quá 10MB, đã bỏ qua");
    }
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSomeonePresent) {
      toast.error("Vui lòng xác nhận sự có mặt của ít nhất một bên!");
      return;
    }
    if (!taskId) {
      toast.error("Thiếu thông tin nhiệm vụ!");
      return;
    }
    // Nếu cả 2 bên có mặt, bắt buộc phải kiểm định đầy đủ tất cả hạng mục
    if (isAttendanceComplete && !isChecklistComplete) {
      toast.error(`Vui lòng hoàn thành kiểm định tất cả ${notCheckedCount} hạng mục còn lại trước khi lưu báo cáo!`);
      return;
    }

    const result = expectedResult;

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
        buyerCheckin: attendance.buyerPresent,
        sellerCheckin: attendance.sellerPresent,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (!taskId) {
    return (
      <TaskSelectorList
        pendingTasks={pendingTasks}
        onBack={() => navigate("/inspector/tasks")}
        onSelectTask={(id) => navigate(`/inspector/create-report?taskId=${id}`)}
      />
    );
  }

  // Thông tin buyer/seller và avatar từ task
  const buyerInfo = getPartyInfo(task, "buyer");
  const sellerInfo = getPartyInfo(task, "seller");
  const buyerName = buyerInfo.name || task?.buyerName || task?.buyer?.fullName || "Người mua";
  const sellerName = sellerInfo.name || task?.sellerName || task?.seller?.fullName || "Người bán";
  const buyerAvatarUrl = task?.buyerUrlImage || buyerInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(buyerName)}&background=3B82F6&color=fff&size=128`;
  const sellerAvatarUrl = task?.sellerUrlImage || sellerInfo.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(sellerName)}&background=F97316&color=fff&size=128`;

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

<<<<<<< HEAD
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
                src={task?.buyerAvatar || buyerAvatarUrl}
                alt="Buyer"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Người mua</p>
                <p className="font-bold text-gray-900">{buyerName}</p>
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
                src={task?.sellerAvatar || sellerAvatarUrl}
                alt="Seller"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase font-bold tracking-wider">Người bán</p>
                <p className="font-bold text-gray-900">{sellerName}</p>
              </div>
              {attendance.sellerPresent && <MdCheckCircle className="text-emerald-500" size={24} />}
            </label>
          </div>
          {!isAttendanceComplete && isSomeonePresent && (
            <p className="mt-4 text-sm text-orange-600 flex items-center gap-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
              <MdWarning size={18} />
              Lưu ý: Báo cáo vắng mặt 1 bên sẽ hủy giao dịch và tự động xử lý tiền cọc theo quy định!
            </p>
          )}
          {!isSomeonePresent && (
            <p className="mt-4 text-sm text-red-600 flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
              <MdWarning size={18} />
              Vui lòng xác nhận sự có mặt của ít nhất một bên để tạo báo cáo!
            </p>
          )}
        </div>
=======
        <AttendanceSection
          task={task}
          attendance={attendance}
          onToggle={handleAttendanceChange}
          isAttendanceComplete={isAttendanceComplete}
          isSomeonePresent={isSomeonePresent}
        />

        <ChecklistSection
          checklist={checklist}
          passCount={passCount}
          failCount={failCount}
          notCheckedCount={notCheckedCount}
          onStatusChange={handleChecklistStatus}
          onNoteChange={handleChecklistNote}
        />
>>>>>>> b82d124dcdc72f3d14468d7a859d4c6d31af20c6

        <IssuesSection
          newIssue={newIssue}
          setNewIssue={setNewIssue}
          issues={formData.issues}
          onAddIssue={addIssue}
          onRemoveIssue={removeIssue}
        />

<<<<<<< HEAD
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
            <p className={`mt-4 text-sm flex items-center gap-2 p-3 rounded-lg border ${isAttendanceComplete ? "text-red-600 bg-red-50 border-red-200" : "text-amber-600 bg-amber-50 border-amber-100"}`}>
              <MdWarning size={18} />
              Còn <strong>{notCheckedCount}</strong> hạng mục chưa được kiểm tra.
              {isAttendanceComplete
                ? " Bắt buộc phải kiểm tra hết trước khi lưu báo cáo!"
                : " Kết quả sẽ bị tính là FAILED."}
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
=======
        <ImageUploadSection
          images={formData.images}
          onUpload={onImageUpload}
          onRemove={removeImage}
        />
>>>>>>> b82d124dcdc72f3d14468d7a859d4c6d31af20c6

        {/* Ghi chú inspector */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Ghi chú riêng của Inspector</h2>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Nhập ghi chú ẩn rủi ro, nhận xét chuyên môn về xe (Người dùng sẽ không thấy phần này)..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 resize-none bg-gray-50"
          />
        </div>

<<<<<<< HEAD
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
              disabled={isSubmitting || !canSubmit}
              title={!isSomeonePresent ? "Cần xác nhận sự có mặt trước" : isAttendanceComplete && !isChecklistComplete ? `Còn ${notCheckedCount} hạng mục chưa được kiểm tra` : ""}
              className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all shadow-lg ${canSubmit && !isSubmitting
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
                  {isAttendanceComplete && !isChecklistComplete && (
                    <span className="text-xs font-normal opacity-80">({notCheckedCount} chưa KT)</span>
                  )}
                </>
              )}
            </button>
          </div>
        </div>
=======
        <StickySubmitBar
          expectedResult={expectedResult}
          isSubmitting={isSubmitting}
          isSomeonePresent={isSomeonePresent}
          onCancel={() => navigate(-1)}
        />
>>>>>>> b82d124dcdc72f3d14468d7a859d4c6d31af20c6
      </form>
    </div>
  );
};

export default CreateReportPage;
