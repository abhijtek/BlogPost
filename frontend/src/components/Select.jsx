import React, { forwardRef, useId } from "react"

function Select({ options, label, className = "", ...props }, ref) {
  const id = useId()

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 inline-block text-xs font-semibold tracking-wide text-muted">
          {label}
        </label>
      )}

      <select
        id={id}
        ref={ref}
        {...props}
        className={`input-glass interactive w-full rounded-xl px-3 py-2 text-sm outline-none transition ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option} className="bg-black text-white">
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default forwardRef(Select)
