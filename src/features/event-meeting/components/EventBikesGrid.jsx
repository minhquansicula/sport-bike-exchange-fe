import React, { useState, useEffect } from "react";
import {
  MdStorefront,
  MdPedalBike,
  MdCheckCircle,
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

  if (error || !imgSrc) {
    return (
      <div
        className={`${className} bg-gray-100 flex items-center justify-center text-gray-400`}
      >
        <MdImage size={24} />
      </div>
    );
  }
  return (
    <img src={imgSrc} alt={alt} className={className} onError={handleError} />
  );
};

const EventBikesGrid = ({
  eventBikes,
  user,
  eventDetail,
  setSelectedViewBike,
  handleDeposit,
  isDepositing,
  handleOpenRegister,
  extractBikeDisplayData,
}) => {
  return (
    <div className="container mx-auto px-4 relative z-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <MdStorefront className="text-orange-500" /> Sẽ Có Mặt Tại Sự Kiện
          </h2>
          <p className="text-slate-500 mt-2 font-medium">
            Khám phá các xe đã đăng ký tham gia giao dịch.
          </p>
        </div>
      </div>

      {eventBikes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
          <MdPedalBike size={64} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-500 font-medium text-lg">
            Chưa có xe nào được duyệt tham gia sự kiện này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventBikes.map((bike) => {
            const bikeInfo = extractBikeDisplayData(bike);
            const isMyBike = user && bikeInfo.sellerId === user.userId;

            return (
              <div
                key={bike.eventBikeId}
                onClick={() => setSelectedViewBike(bike)}
                className="bg-white rounded-[20px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 group flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <BikeImage
                    src={bikeInfo.images[0]}
                    alt={bikeInfo.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-xs font-bold text-green-600 flex items-center gap-1.5 shadow-sm">
                    <MdCheckCircle size={16} /> Đã duyệt
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-black text-slate-900 text-lg mb-2 line-clamp-2">
                    {bikeInfo.title}
                  </h3>
                  <p className="text-orange-600 font-bold text-lg mb-4">
                    {bikeInfo.price.toLocaleString()} đ
                  </p>
                  <div className="flex flex-col gap-2 text-sm text-slate-500 font-medium mt-auto mb-4">
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                      <span>Chủ xe</span>
                      <span className="text-slate-900 font-bold">
                        {bikeInfo.sellerName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                      <span>Tình trạng</span>
                      <span className="text-slate-900 font-bold">
                        {bikeInfo.condition}
                      </span>
                    </div>
                  </div>

                  {eventDetail.status !== "completed" && (
                    <>
                      {isMyBike ? (
                        <div className="w-full py-2.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl font-bold text-center">
                          Xe của bạn
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeposit(bike);
                          }}
                          disabled={isDepositing}
                          className="w-full py-2.5 bg-slate-900 hover:bg-orange-500 text-white rounded-xl font-bold transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                          <MdShoppingCartCheckout size={20} />{" "}
                          {isDepositing ? "Đang xử lý..." : "Đặt cọc"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {eventDetail.status === "upcoming" && (
        <div className="mt-16 text-center bg-slate-900 rounded-[32px] p-10 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
          <div className="relative z-10">
            <h3 className="text-3xl font-black text-white mb-4">
              Bạn có xe muốn bán?
            </h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Đăng ký kiểm định trước để quá trình giao dịch tại sự kiện diễn ra
              nhanh chóng và uy tín hơn.
            </p>
            <button
              onClick={handleOpenRegister}
              className="bg-orange-500 hover:bg-orange-400 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-lg hover:-translate-y-1"
            >
              Đăng Ký Ngay
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventBikesGrid;
