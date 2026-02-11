import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { useForm } from "react-hook-form"

import authService from "../psappwrite/auth"
import { login } from "../store/authSlice"
import Button from "./Button"
import Input from "./Input"
import Logo from "../Logo"

export default function SignUp() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const create = async (data) => {
    setError("")
    try {
      const created = await authService.createAccount({ ...data })
      if (created) {
        const user = await authService.getCurrentUser()
        if (user) dispatch(login({ userData: user }))
        navigate("/")
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex w-full items-center justify-center px-4">
      <div className="surface-card w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-[96px]">
            <Logo width="100%" />
          </span>
        </div>

        <h2 className="text-center text-2xl font-semibold tracking-tight text-app">Create your account</h2>
        <p className="mt-2 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="interactive menu-link font-semibold">
            Sign in
          </Link>
        </p>

        {error && <p className="mt-4 text-center text-sm text-red-300">{error}</p>}

        <form onSubmit={handleSubmit(create)} className="mt-6 space-y-4">
          <div>
            <Input
              label="Full name"
              placeholder="Enter your full name"
              {...register("username", {
                required: "Full name is required",
              })}
            />
            {errors.username?.message && <p className="mt-1 text-xs text-red-300">{errors.username.message}</p>}
          </div>

          <div>
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                validate: {
                  matchPattern: (value) =>
                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || "Enter a valid email address",
                },
              })}
            />
            {errors.email?.message && <p className="mt-1 text-xs text-red-300">{errors.email.message}</p>}
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
            {errors.password?.message && <p className="mt-1 text-xs text-red-300">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="mt-2 w-full">
            Create account
          </Button>
        </form>
      </div>
    </div>
  )
}
