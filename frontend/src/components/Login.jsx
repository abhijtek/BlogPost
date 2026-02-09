import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

import authService from "../psappwrite/auth"
import { login as authLogin } from "../store/authSlice"
import Button from "./Button.jsx"
import Input from "./Input.jsx"
import Logo from "../Logo.jsx"

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const login = async (data) => {
    setError("")
    try {
      const session = await authService.login({
        email: data.email,
        password: data.password,
      })

      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin(userData))
        navigate("/")
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-8">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-[96px]">
            <Logo width="100%" />
          </span>
        </div>

        {/* Header */}
        <h2 className="text-center text-2xl font-semibold tracking-tight text-slate-100">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-slate-200 hover:text-white"
          >
            Sign up
          </Link>
        </p>

        {error && (
          <p className="mt-4 text-center text-sm text-red-400">{error}</p>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(login)} className="mt-6 space-y-4">
          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                      value,
                    ) || "Enter a valid email address",
                },
              })}
            />
            {errors.email?.message && (
              <p className="mt-1 text-xs text-slate-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
              })}
            />
            {errors.password?.message && (
              <p className="mt-1 text-xs text-slate-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="mt-2 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Login
