import React from "react"
import { useDispatch } from "react-redux"
import authService from "../psappwrite/auth"
import { logout } from "../store/authSlice"

function LogoutBtn() {
  const dispatch = useDispatch()

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout())
    })
  }

  return (
    <button onClick={logoutHandler} className="interactive menu-link w-full rounded-lg px-3 py-2 text-left text-sm font-semibold">
      Logout
    </button>
  )
}

export default LogoutBtn
