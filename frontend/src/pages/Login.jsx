import React from "react"
import { Login as LoginComponent } from "../components/Login.jsx"

function Login() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-10">
      <LoginComponent />
    </div>
  )
}

export default Login
