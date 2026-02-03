import React,{forwardRef, useId} from 'react'


const Input = forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
},ref){
    const id = useId();
    return (
    <div className="w-full">
        {label && (
          <label className="mb-2 inline-block text-sm font-semibold text-slate-200" htmlFor={id}>
            {label}
          </label>
        )}
        <input
          type={type}
          className={`input-glass w-full rounded-2xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 ${className}`}
          ref={ref}
          {...props}
          id={id}
        />
    </div>
    )
})

export default Input
