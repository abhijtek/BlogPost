import React from "react"
import { Link, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

import Container from "../container/Container.jsx"
import Logo from "../../Logo.jsx"

function Header({ theme, setTheme }) {
  const { pathname } = useLocation()
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const isAdmin = userData?.role === "admin"

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus && !isAdmin },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
  ]

  return (
    <header className="header-shell sticky top-0 z-40">
      <Container className="py-3">
        <nav className="surface-soft flex items-center justify-between rounded-2xl px-3 py-2 sm:px-4">
          <Link to="/" className="interactive flex items-center gap-3 rounded-xl px-2 py-1.5">
            <Logo width="52px" />
            <div>
              <p className="text-sm font-semibold text-app">BlogPost</p>
              <p className="text-[11px] text-muted">Builder journal</p>
            </div>
          </Link>

          <ul className="flex items-center gap-1.5 sm:gap-2">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <Link
                      to={item.slug}
                      className={`interactive menu-link rounded-full px-3 py-1.5 text-xs font-semibold sm:text-sm ${
                        pathname === item.slug ? "btn-glass" : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ),
            )}

            {authStatus && (
              <li>
                <Link
                  to="/panel"
                  className="interactive btn-glass flex h-9 w-9 items-center justify-center rounded-full overflow-hidden"
                  aria-label="User panel"
                >
                  {userData?.avatar?.url ? (
                    <img
                      src={userData.avatar.url}
                      alt={userData?.username || "User"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-bold">
                      {(userData?.username || "U")[0].toUpperCase()}
                    </span>
                  )}
                </Link>
              </li>
            )}

            <li>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="interactive btn-glass flex h-9 w-9 items-center justify-center rounded-full"
              >
                {theme === "dark" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
                  </svg>
                ) : (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2" />
                    <path d="M12 20v2" />
                    <path d="M4.93 4.93l1.41 1.41" />
                    <path d="M17.66 17.66l1.41 1.41" />
                    <path d="M2 12h2" />
                    <path d="M20 12h2" />
                  </svg>
                )}
              </button>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header
