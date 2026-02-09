import React, { forwardRef, useId } from "react"

const Input = forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref,
) {
  const id = useId()

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 inline-block text-xs font-medium text-slate-400"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        ref={ref}
        type={type}
        {...props}
        className={`
          input-glass
          w-full
          rounded-xl
          px-3
          py-2
          text-sm
          outline-none
          transition
          focus:ring-2
          focus:ring-emerald-400/30
          ${className}
        `}
      />
    </div>
  )
})

export default Input
