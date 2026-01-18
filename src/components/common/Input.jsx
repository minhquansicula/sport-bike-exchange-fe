import React from "react";

const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
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
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full px-4 py-2.5 rounded-lg border bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200
          ${
            error
              ? "border-red-500 focus:ring-red-200 focus:border-red-500"
              : "border-gray-300 focus:ring-orange-100 focus:border-primary"
          }
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
