import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function AuthLayout({children, authentication = true}) {
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    console.log("auth status component",authStatus)
    useEffect(() => {
        //TODO: make it more easy to understand
        console.log("authlayout loaded")

        // if (authStatus ===true){
        //     navigate("/")
        // } else if (authStatus === false) {
        //     navigate("/login")
        // }
        
        //let authValue = authStatus === true ? true : false

        if(authentication && authStatus !== authentication){
            navigate("/login")
        } else if(!authentication && authStatus !== authentication){
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, navigate, authentication])

  return loader ? (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="glass-card mesh-border rounded-full px-6 py-3 text-sm font-semibold text-slate-200">
        Loading...
      </div>
    </div>
  ) : (
    <>{children}</>
  )
}
