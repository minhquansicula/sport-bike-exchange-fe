import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { inspectorService } from "../../../services/inspectorService";
import { toast } from "react-hot-toast";
import {
  MdArrowBack,
  MdLocationOn,
  MdAccessTime,
  MdPerson,
  MdPhone,
  MdPedalBike,
  MdAttachMoney,
  MdCheckCircle,
  MdWarning,
} from "react-icons/md";
import formatCurrency from "../../../utils/formatCurrency";

const InspectorTaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await inspectorService.getTaskById(id);
        setTask(res.result);
      } catch (error) {
        console.error("Lỗi tải nhiệm vụ:", error);
        toast.error("Không thể tải thông tin nhiệm vụ");
        navigate("/inspector/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
      </div>
    );
  }

  if (!task) return null;

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
            Chi tiết nhiệm vụ
          </h1>
          <p className="text-gray-500 text-sm mt-1">Mã nhiệm vụ: #{task.id}</p>
        </div>
      </div>

      {/* Task Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={task.bikeImage || "https://via.placeholder.com/300"}
            alt={task.bikeName}
            className="w-full md:w-48 h-48 rounded-xl object-cover border border-gray-200"
          />
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {task.bikeName}
            </h2>
            <p className="text-emerald-600 font-bold text-2xl mb-4">
              {formatCurrency(task.price)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                  <MdPerson size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Người mua</p>
                  <p className="font-medium">{task.buyer?.name}</p>
                  <a
                    href={`tel:${task.buyer?.phone}`}
                    className="text-xs text-blue-600 flex items-center gap-1 mt-1"
                  >
                    <MdPhone size={14} /> {task.buyer?.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
                  <MdPerson size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Người bán</p>
                  <p className="font-medium">{task.seller?.name}</p>
                  <a
                    href={`tel:${task.seller?.phone}`}
                    className="text-xs text-blue-600 flex items-center gap-1 mt-1"
                  >
                    <MdPhone size={14} /> {task.seller?.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <MdLocationOn size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Địa điểm</p>
                  <p className="font-medium">{task.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                  <MdAccessTime size={18} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Thời gian</p>
                  <p className="font-medium">{task.scheduledTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          to={`/inspector/create-report?taskId=${task.id}`}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold text-center transition-colors shadow-lg"
        >
          Bắt đầu kiểm định
        </Link>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-4 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default InspectorTaskDetailPage;
