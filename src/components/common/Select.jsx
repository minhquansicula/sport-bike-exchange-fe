import React from "react";

const Select = ({
  label,
  options = [], // Mảng dạng [{ value: '1', label: 'Option 1' }]
  value,
  onChange,
  error,
  placeholder = "-- Chọn --",
  className = "",
  ...props
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`
            w-full px-4 py-2.5 appearance-none rounded-lg border bg-white text-gray-900 focus:outline-none focus:ring-2 transition-all duration-200
            ${
              error
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-orange-100 focus:border-primary"
            }
          `}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Mũi tên custom */}
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Select;
