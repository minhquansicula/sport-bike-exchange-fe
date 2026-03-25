import { useEffect, useMemo, useRef, useState } from "react";

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

const createInitialChecklist = () =>
  DEFAULT_CHECKLIST.map((item) => ({
    name: item.name,
    status: "NOT_CHECKED",
    note: "",
  }));

export const useCreateReportForm = () => {
  const [checklist, setChecklist] = useState(createInitialChecklist);
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

  const imagesRef = useRef([]);

  useEffect(() => {
    imagesRef.current = formData.images;
  }, [formData.images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

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

  const handleAttendanceChange = (role) => {
    setAttendance((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => file.size <= 10 * 1024 * 1024);

    const newImages = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
    }));

    setFormData((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));

    return {
      skippedCount: files.length - validFiles.length,
    };
  };

  const removeImage = (imageId) => {
    const img = formData.images.find((i) => i.id === imageId);
    if (img) {
      URL.revokeObjectURL(img.preview);
    }

    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((i) => i.id !== imageId),
    }));
  };

  const setNotes = (notes) => {
    setFormData((prev) => ({ ...prev, notes }));
  };

  const addIssue = () => {
    if (!newIssue.trim()) return;
    setFormData((prev) => ({
      ...prev,
      issues: [...prev.issues, newIssue.trim()],
    }));
    setNewIssue("");
  };

  const removeIssue = (index) => {
    setFormData((prev) => ({
      ...prev,
      issues: prev.issues.filter((_, i) => i !== index),
    }));
  };

  const stats = useMemo(() => {
    const passCount = checklist.filter((i) => i.status === "PASS").length;
    const failCount = checklist.filter((i) => i.status === "FAIL").length;
    const notCheckedCount = checklist.filter(
      (i) => i.status === "NOT_CHECKED"
    ).length;

    return {
      passCount,
      failCount,
      notCheckedCount,
    };
  }, [checklist]);

  const isAttendanceComplete =
    attendance.buyerPresent && attendance.sellerPresent;
  const isSomeonePresent = attendance.buyerPresent || attendance.sellerPresent;
  const expectedResult = checklist.every((i) => i.status === "PASS")
    ? "SUCCESS"
    : "FAILED";

  return {
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
    ...stats,
  };
};
