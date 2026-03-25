import React from "react";
import { MdArrowBack, MdPedalBike } from "react-icons/md";

const TaskSelectorList = ({ pendingTasks, onBack, onSelectTask }) => {
  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-full shadow-sm hover:bg-emerald-50 transition-colors"
        >
          <MdArrowBack size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            Chọn xe cần kiểm định
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Danh sách các yêu cầu đang chờ xử lý
          </p>
        </div>
      </div>

      {pendingTasks.length > 0 ? (
        <div className="grid gap-4">
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:border-emerald-200 transition-all shadow-sm"
            >
              <div className="flex items-center gap-4">
                <img
                  src={task.bikeImage || "https://via.placeholder.com/150"}
                  alt="bike"
                  className="w-20 h-20 rounded-xl object-cover border border-gray-100"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{task.bikeName}</h3>
                  <p className="text-sm text-gray-500">Mã GD: #{task.id}</p>
                  <p className="text-xs text-blue-600 mt-1 uppercase font-bold tracking-wider">
                    {new Date(task.scheduledTime).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onSelectTask(task.id)}
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
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Chưa có xe nào cần báo cáo
          </h3>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Tất cả các nhiệm vụ hiện tại đã được hoàn thành hoặc chưa đến giờ
            kiểm định.
          </p>
          <button
            onClick={onBack}
            className="px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-colors"
          >
            Xem nhiệm vụ khác
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskSelectorList;
