import React from 'react'
import Container from '../container/container'
import Logo from "../index.js"
import { useSelector,useDispatch } from 'react-redux'

import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import LogoutBtn from './Logout'
function Header() {
  const authStatus = useSelector((state)=>state.auth.status)

  const navigate= useNavigate();

    const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
  },
  {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
  },
  {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
  },
  {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
  },
  ]
  return (
    <div className='py-3 shadow bg-gray-500'>
      <Container>
        <nav className='flex'>
            <div className='mr-4'>
              <Link to ="/">
              <Logo width = "70px"></Logo>
              </Link>
              <ul className='flex ml-auto'>
               {navItems.map((item)=>item.active ? <li key={item.name}>
                <button
                className='p-4 rounded-2xl bg-blue-500
                shadow'
                onClick={()=>navigate(item.slug)}>
                  {item.name}
                </button>
               </li>:null)}
               {authStatus && (<li>
                <LogoutBtn>
                  
                </LogoutBtn>
               </li>)}
              </ul>
            </div>
        </nav>
      </Container>
    </div>
  )
}

export default Header