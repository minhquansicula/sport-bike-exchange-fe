import React from "react";
import { MdAddAPhoto, MdCameraAlt, MdClose, MdImage } from "react-icons/md";

const ImageUploadSection = ({ images, onUpload, onRemove }) => {
  return (
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
          <p className="text-xs text-gray-400 font-medium">
            Hỗ trợ PNG, JPG (Tối đa 10MB)
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={onUpload}
        />
      </label>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm"
            >
              <img
                src={image.preview}
                alt={image.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(image.id)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-transform hover:scale-110 shadow-lg"
                >
                  <MdClose size={20} />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-xs truncate font-medium">
                  {image.name}
                </p>
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
  );
};

export default ImageUploadSection;
