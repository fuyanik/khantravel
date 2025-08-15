import React from "react";

export default function Input({ type = "text", value, onChange, placeholder = "", className = "" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border px-3 py-2 rounded w-full ${className}`}
    />
  );
} 