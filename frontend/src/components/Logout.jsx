import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../psappwrite/auth'
import { logout } from '../store/authSlice'

function LogoutBtn() {
  console.log("clicked on logout button")
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
      className="btn-glass mesh-border inline-block rounded-full px-5 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg"
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutBtn
