import React from "react";

const Loading = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 font-medium animate-pulse">
            Đang tải...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
