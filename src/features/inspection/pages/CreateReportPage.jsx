import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { inspectorService } from "../../../services/inspectorService";
import { uploadService } from "../../../services/uploadService";
import { toast } from "react-hot-toast";
import { useInspectorTaskDetail } from "../hooks/useInspectorTaskDetail";
import { useInspectorTasks } from "../hooks/useInspectorTasks";
import { MdArrowBack, MdPedalBike } from "react-icons/md";
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

  const onImageUpload = (event) => {
    const { skippedCount } = handleImageUpload(event);
    if (skippedCount > 0) {
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

        <IssuesSection
          newIssue={newIssue}
          setNewIssue={setNewIssue}
          issues={formData.issues}
          onAddIssue={addIssue}
          onRemoveIssue={removeIssue}
        />

        <ImageUploadSection
          images={formData.images}
          onUpload={onImageUpload}
          onRemove={removeImage}
        />

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

        <StickySubmitBar
          expectedResult={expectedResult}
          isSubmitting={isSubmitting}
          isSomeonePresent={isSomeonePresent}
          onCancel={() => navigate(-1)}
        />
      </form>
    </div>
  );
};

export default CreateReportPage;
