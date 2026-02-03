import React from 'react'

export default function Container({children}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
  )
}

