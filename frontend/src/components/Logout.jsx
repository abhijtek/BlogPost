import React from 'react'
import {useDispatch} from 'react-redux'
import authService from '../psappwrite/auth'
import { logout } from '../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
      className="text-sm font-semibold text-slate-200 transition hover:text-white"
      onClick={logoutHandler}
    >
      Logout
    </button>
  )
}

export default LogoutBtn
