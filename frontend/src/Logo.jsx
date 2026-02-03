import React from 'react'

export default function Logo({width = "100px"}) {
  return (
    <img
      src="/bp-logo.png"
      alt="BP logo"
      style={{ width }}
      className="block h-auto max-w-full rounded-full object-cover"
    />
  )
}
