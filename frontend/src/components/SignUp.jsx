import React, {useState} from 'react'
import authService from '../psappwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import { login } from '../store/authSlice'
import Button from './Button'
import Input from './Input'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import Logo from '../Logo'
export default function SignUp() {
    console.log("cliked on signup component");
    
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: { errors }} = useForm()

    const create = async(data) => {
        console.log("here is data",data);
        
        setError("")
        try {
            const userData = await authService.createAccount({...data})
            if (userData) {
                const userData = await authService.getCurrentUser()
                console.log("received data upon create account-dispatched for login",userData)
                if(userData) dispatch(login(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    
    <div className="flex items-center justify-center px-4">
            <div className="glass-card mesh-border mx-auto w-full max-w-lg rounded-3xl p-10">
            <div className="mb-6 flex justify-center">
                    <span className="inline-block w-full max-w-[120px]">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="text-center text-3xl font-semibold leading-tight text-slate-100">Sign up to create account</h2>
                <p className="mt-2 text-center text-sm text-slate-300">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-slate-200 transition-all duration-200 hover:text-white"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="mt-6 text-center text-sm text-slate-300">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        {...register("username", {
                            required: "Full name is required",
                        })}
                        />
                        {errors.username?.message && (
                          <p className="text-xs text-slate-300">{errors.username.message}</p>
                        )}
                        <Input
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        {errors.email?.message && (
                          <p className="text-xs text-slate-300">{errors.email.message}</p>
                        )}
                        <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",})}
                        />
                        {errors.password?.message && (
                          <p className="text-xs text-slate-300">{errors.password.message}</p>
                        )}
                        <Button type="submit" className="w-full">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

    </div>
  )
}
