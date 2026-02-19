import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

export default function AuthLayout({ children, authentication = true }) {
  const navigate = useNavigate()
  const authStatus = useSelector((state) => state.auth.status)
  const initialized = useSelector((state) => state.auth.initialized)

  useEffect(() => {
    if (!initialized) return
    if (authentication && authStatus !== authentication) {
      navigate("/login")
    } else if (!authentication && authStatus !== authentication) {
      navigate("/")
    }
  }, [initialized, authStatus, navigate, authentication])

  if (!initialized && authentication) return null

  return <>{children}</>
}
