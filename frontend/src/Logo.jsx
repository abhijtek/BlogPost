import React from "react"

export default function Logo({ width = 96 }) {
  return (
    <img
      src="/bp-logo.png"
      alt="BlogPost logo"
      style={{ width }}
      className="
        block
        h-auto
        select-none
        rounded-xl
        object-contain
        transition
        hover:opacity-90
      "
    />
  )
}
