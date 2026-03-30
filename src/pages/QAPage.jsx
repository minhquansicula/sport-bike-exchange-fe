import React from "react";

const QAPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
          Trung tâm hỏi đáp
        </h1>
        <p className="mt-3 text-gray-600">
          Đây là bước đầu của trang Q&A. Bạn có thể bổ sung danh sách câu hỏi
          và câu trả lời cố định ở đây.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-orange-600">Câu hỏi mẫu</p>
          <h2 className="mt-2 text-lg font-bold text-gray-900">
            Làm sao để đặt lịch kiểm định xe?
          </h2>
          <p className="mt-2 text-gray-600 leading-relaxed">
            Bạn vào trang chi tiết xe, bấm Đặt cọc, sau đó hệ thống sẽ sắp xếp
            lịch kiểm định với inspector.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QAPage;
