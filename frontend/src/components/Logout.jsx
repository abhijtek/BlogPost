import React from 'react'
import { useSelector,useDispatch } from 'react-redux'
import authService from '../psappwrite/auth'
import { Link } from 'react-router'
import { logout } from '../store/authSlice'
function LogoutBtn() {
    const dispatch = useDispatch();
    const logoutHandler = ()=>{
        authService.logout()
        .then(()=>{dispatch(logout())})
    }
  return (
    <div className='p-2 bg-blue-500 rounded-2xl shadow-2xs'>Logout</div>
  )
}

export default LogoutBtn