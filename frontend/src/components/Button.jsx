import React from "react"

function Button({
  children,
  type = "button",
  className = "",
  variant = "primary", // primary | ghost | danger
  ...props
}) {
  const base =
    "btn-glass inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-emerald-400/30"

  const variants = {
    primary: "hover:-translate-y-0.5",
    ghost: "bg-transparent shadow-none hover:bg-white/5",
    danger:
      "border border-red-400/30 bg-red-500/10 text-red-300 hover:bg-red-500/20",
  }

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
