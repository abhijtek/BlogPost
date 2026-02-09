import React, { forwardRef, useId } from "react"

function Select({ options, label, className = "", ...props }, ref) {
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

      <select
        id={id}
        ref={ref}
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
      >
        {options?.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-slate-900 text-white"
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default forwardRef(Select)
