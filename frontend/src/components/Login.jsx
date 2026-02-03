import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import Button from './Button.jsx'
import Input from './Input.jsx'
import {useDispatch, useSelector} from "react-redux"
import authService from '../psappwrite/auth'
import {useForm} from "react-hook-form"
import Logo from '../Logo.jsx'
function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        console.log("form data in login component",data);
        setError("")
        try {
            const session = await authService.login({email:data.email,password:data.password});
            if (session) {
                const userData = await authService.getCurrentUser()
                console.log("user data received in login component",userData);

                if(userData){ dispatch(authLogin(userData));
                
            }
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="flex w-full items-center justify-center px-4">
        <div className="glass-card mesh-border mx-auto w-full max-w-lg rounded-3xl p-10">
        <div className="mb-6 flex justify-center">
          <span className="inline-block w-full max-w-[100px]">
              <Logo width="100%" />
          </span>
        </div>
        <h2 className="text-center text-3xl font-semibold leading-tight text-slate-100">Sign in to your account</h2>
        <p className="mt-2 text-center text-sm text-slate-300">
          Don&apos;t have any account?&nbsp;
          <Link
            to="/signup"
            className="font-semibold text-slate-200 transition-all duration-200 hover:text-white"
          >
            Sign Up
          </Link>
        </p>
        {error && <p className="mt-6 text-center text-sm text-slate-300">{error}</p>}
        <form onSubmit={handleSubmit(login)} className="mt-8">
            <div className="space-y-5">
                <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                {...register("email", {
                    required: true,
                    validate: {
                        matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                        "Email address must be a valid address",
                    }
                })}
                />
                <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type="submit"
                className="w-full"
                >Sign in</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login
