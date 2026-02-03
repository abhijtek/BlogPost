import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "",
  textColor = "text-slate-100",
  className = "",
  ...props
}) {
  return (
    <button
      className={`btn-glass mesh-border rounded-full px-6 py-2 text-sm font-semibold tracking-wide transition hover:-translate-y-0.5 hover:shadow-xl ${bgColor} ${textColor} ${className}`}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
