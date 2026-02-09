import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authentication && authStatus !== authentication) {
      navigate("/login")
    } else if (!authentication && authStatus !== authentication) {
      navigate("/")
    }
    setLoading(false)
  }, [authStatus, navigate, authentication])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-sm font-medium text-slate-300">
          Loading…
        </div>
      </div>
    )
  }

  return <>{children}</>
}
