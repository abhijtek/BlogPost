import React, { forwardRef, useId } from 'react'

function Select({
    options,
    label,
    className,
    ...props

},ref) {
    const id = useId();
  return (
    <div className="w-full">
       {label && (
         <label htmlFor={id} className="mb-2 inline-block text-sm font-semibold text-slate-200">
           {label}
         </label>
       )}
       <select
         id={id}
         ref={ref}
         {...props}
         className={`input-glass w-full rounded-2xl px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20 ${className}`}
       >
        {options?.map(option=> (
          <option key={option} value={option} className="bg-slate-900 text-slate-100">
            {option}
          </option>
        ))}
       </select>
    </div>
  )
}

export default forwardRef( Select)
