import React from 'react'
import Container from '../container/Container.jsx'
import Logo from '../../Logo.jsx'
import { useSelector,useDispatch } from 'react-redux'

import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import LogoutBtn from '../Logout.jsx'
function Header({ theme, setTheme }) {
  const authStatus = useSelector((state)=>state.auth.status)
  console.log(authStatus)
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
    <div className="sticky top-0 z-40 border-b border-white/10 bg-neutral-900/70 backdrop-blur-xl header-shell">
      <Container>
        <nav className="flex flex-wrap items-center justify-between gap-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <Logo width="70px"></Logo>
            <span className="text-lg font-semibold tracking-tight text-slate-100">BlogPost</span>
          </Link>
          <ul className="ml-auto flex flex-wrap items-center gap-3">
            {navItems.map((item)=>item.active ? (
              <li key={item.name}>
                <button
                  className="btn-glass mesh-border rounded-full px-5 py-2 text-sm font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:text-white hover:shadow-lg"
                  onClick={()=> navigate(item.slug)}
                >
                  {item.name}
                </button>
              </li>
            ) : null)}
            {authStatus && (
              <li>
                <LogoutBtn></LogoutBtn>
              </li>
            )}
            <li>
              <button
                type="button"
                className="btn-glass mesh-border theme-toggle flex h-10 w-10 items-center justify-center rounded-full text-slate-100 transition hover:-translate-y-0.5 hover:text-white hover:shadow-lg"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
              >
                {theme === "dark" ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
                  </svg>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </Container>
    </div>
  )
}

export default Header
