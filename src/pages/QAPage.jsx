import React, { useMemo, useState } from "react";
import { MdExpandMore, MdUpdate } from "react-icons/md";
import { QA_SECTIONS } from "../mockData/qnaData";

const QAPage = () => {
  const [openItemIds, setOpenItemIds] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const totalQuestions = useMemo(
    () => QA_SECTIONS.reduce((sum, section) => sum + section.items.length, 0),
    [],
  );

  const categoryFilters = useMemo(
    () =>
      QA_SECTIONS.map((section) => ({
        id: section.id,
        label: section.title,
        count: section.items.length,
      })),
    [],
  );

  const visibleSections = useMemo(() => {
    if (selectedCategory === "all") return QA_SECTIONS;
    return QA_SECTIONS.filter((section) => section.id === selectedCategory);
  }, [selectedCategory]);

  const visibleQuestionCount = useMemo(
    () =>
      visibleSections.reduce((sum, section) => sum + section.items.length, 0),
    [visibleSections],
  );

  const toggleItem = (itemId) => {
    setOpenItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  const formatUpdatedDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="container mx-auto px-4 py-10 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-3xl border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-amber-50 px-6 py-7 md:px-8 md:py-9 shadow-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
            Trung tâm hỏi đáp
          </h1>
          <p className="mt-3 text-gray-600 max-w-3xl leading-relaxed">
            Các câu hỏi thường gặp được biên soạn sẵn để bạn xử lý nhanh những
            tình huống phổ biến trong quá trình mua bán, kiểm định và thanh
            toán.
          </p>
          <div className="mt-5 inline-flex items-center rounded-full bg-white border border-orange-200 px-3 py-1.5 text-sm font-semibold text-orange-700">
            {visibleQuestionCount}/{totalQuestions} câu hỏi
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
              selectedCategory === "all"
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-orange-200 bg-white text-orange-700 hover:bg-orange-50"
            }`}
          >
            Tất cả
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                selectedCategory === "all"
                  ? "bg-white/20 text-white"
                  : "bg-orange-100 text-orange-700"
              }`}
            >
              {totalQuestions}
            </span>
          </button>

          {categoryFilters.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? "border-orange-600 bg-orange-600 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:bg-orange-50"
                }`}
              >
                {category.label}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 space-y-6">
          {visibleSections.map((section) => (
            <section
              key={section.id}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-b border-gray-100 px-5 py-4 md:px-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {section.title}
                </h2>
                <span className="inline-flex w-fit items-center rounded-full bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
                  {section.items.length} câu hỏi
                </span>
              </div>

              <div className="divide-y divide-gray-100">
                {section.items.map((item) => {
                  const isOpen = openItemIds.includes(item.id);

                  return (
                    <article key={item.id} className="px-4 py-2 md:px-6">
                      <button
                        type="button"
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-start justify-between gap-3 rounded-xl px-3 py-3 text-left hover:bg-orange-50/60 transition-colors"
                      >
                        <div>
                          <p className="text-sm md:text-base font-semibold text-gray-900">
                            {item.question}
                          </p>
                        </div>
                        <MdExpandMore
                          size={24}
                          className={`mt-0.5 shrink-0 text-gray-400 transition-transform duration-200 ${
                            isOpen ? "rotate-180 text-orange-600" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="pb-3 px-3 md:pr-11">
                          <p className="rounded-xl border border-orange-100 bg-orange-50/40 px-4 py-3 text-sm md:text-base text-gray-700 leading-relaxed">
                            {item.answer}
                          </p>
                          <div className="mt-2 flex justify-end">
                            <p className="inline-flex items-center gap-1.5 text-xs text-gray-500">
                              <MdUpdate size={14} />
                              Cập nhật: {formatUpdatedDate(item.updatedAt)}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QAPage;
