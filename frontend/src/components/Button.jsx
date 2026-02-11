import React from "react"

function Button({
  children,
  type = "button",
  className = "",
  variant = "primary", // primary | ghost | danger
  ...props
}) {
  const base =
    "interactive btn-glass inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none"

  const variants = {
    primary: "",
    ghost: "bg-transparent shadow-none",
    danger: "border border-red-400/40 bg-red-500/10 text-red-200",
  }

  return (
    <button type={type} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
