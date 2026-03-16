import React, { useState, useEffect } from "react";
import {
  MdInfoOutline,
  MdClose,
  MdPerson,
  MdSettingsSuggest,
  MdShoppingCartCheckout,
  MdImage,
} from "react-icons/md";

const BikeImage = ({ src, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);
  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);
  const handleError = () => setError(true);
  if (error || !imgSrc)
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-gray-400`}
      >
        <MdImage size={24} />
      </div>
    );
  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

const BikeDetailModal = ({
  selectedViewBike,
  setSelectedViewBike,
  user,
  eventDetail,
  handleDeposit,
  isDepositing,
  extractBikeDisplayData,
}) => {
  if (!selectedViewBike) return null;

  const bikeInfo = extractBikeDisplayData(selectedViewBike);
  const isMyBike = user && bikeInfo.sellerId === user.userId;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col relative my-auto animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white rounded-t-3xl z-10">
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <MdInfoOutline className="text-orange-500" /> Chi tiết xe tham gia
          </h3>
          <button
            onClick={() => setSelectedViewBike(null)}
            className="p-2 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <BikeImage
                  src={bikeInfo.images[0]}
                  alt={bikeInfo.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {bikeInfo.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                  {bikeInfo.images.map((img, idx) => (
                    <BikeImage
                      key={idx}
                      src={img}
                      alt=""
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2">
                  {bikeInfo.title}
                </h2>
                <p className="text-3xl font-black text-orange-600">
                  {bikeInfo.price.toLocaleString()} đ
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                  <MdPerson size={24} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">
                    Người đăng bán
                  </p>
                  <p className="font-bold text-slate-900">
                    {bikeInfo.sellerName}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <MdSettingsSuggest className="text-slate-400" /> Thông số kỹ
                  thuật
                </h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                  {[
                    { label: "Thương hiệu", value: bikeInfo.brand },
                    { label: "Danh mục", value: bikeInfo.category },
                    { label: "Tình trạng", value: bikeInfo.condition },
                    { label: "Năm sản xuất", value: bikeInfo.year },
                    { label: "Chất liệu khung", value: bikeInfo.frameMaterial },
                    { label: "Size khung", value: bikeInfo.frameSize },
                    { label: "Màu sắc", value: bikeInfo.color },
                    { label: "Bánh xe", value: bikeInfo.wheelSize },
                    { label: "Vành xe", value: bikeInfo.rim },
                    { label: "Loại phanh", value: bikeInfo.brakeType },
                    { label: "Loại phuộc", value: bikeInfo.forkType },
                    { label: "Giảm xóc", value: bikeInfo.shockAbsorber },
                    { label: "Bộ truyền động", value: bikeInfo.drivetrain },
                    { label: "Số líp/tốc độ", value: bikeInfo.numberOfGears },
                    { label: "Đĩa", value: bikeInfo.chainring },
                    { label: "Xích", value: bikeInfo.chain },
                    { label: "Ghi đông", value: bikeInfo.handlebar },
                    { label: "Yên xe", value: bikeInfo.saddle },
                    { label: "Trọng lượng", value: bikeInfo.weight },
                  ].map((spec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3 rounded-lg border border-slate-100"
                    >
                      <span className="block text-slate-400 text-xs mb-1">
                        {spec.label}
                      </span>
                      <span
                        className="font-bold text-slate-800 line-clamp-1"
                        title={spec.value}
                      >
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mô tả thêm</h4>
                <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-wrap">
                  {bikeInfo.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
          <button
            onClick={() => setSelectedViewBike(null)}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-100"
          >
            Đóng
          </button>
          {eventDetail.status !== "completed" && (
            <>
              {isMyBike ? (
                <span className="px-6 py-2.5 bg-slate-200 text-slate-500 rounded-xl font-bold cursor-not-allowed">
                  Đây là xe của bạn
                </span>
              ) : (
                <button
                  onClick={() => handleDeposit(selectedViewBike)}
                  disabled={isDepositing}
                  className="flex items-center gap-2 px-8 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all"
                >
                  <MdShoppingCartCheckout size={20} />{" "}
                  {isDepositing ? "Đang xử lý..." : "Đặt cọc ngay"}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BikeDetailModal;
