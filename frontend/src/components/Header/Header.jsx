import React from "react"
import { Link } from "react-router"
import { useSelector } from "react-redux"

import Container from "../container/Container.jsx"
import Logo from "../../Logo.jsx"

function Header({ theme, setTheme }) {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)

  const navItems = [
    { name: "Home", slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ]

  return (
    <header className="header-shell sticky top-0 z-40">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <Logo width="56px" />
            <span className="text-base font-semibold tracking-tight text-app">
              BlogPost
            </span>
          </Link>

          {/* Nav */}
          <ul className="flex items-center gap-4">
            {navItems.map(
              (item) =>
                item.active && (
                  <li key={item.name}>
                    <Link
                      to={item.slug}
                      className="text-sm font-medium text-muted transition hover:text-app"
                    >
                      {item.name}
                    </Link>
                  </li>
                ),
            )}

            {/* User */}
            {authStatus && (
              <li>
                <Link
                  to="/panel"
                  className="btn-glass flex h-9 w-9 items-center justify-center rounded-full"
                  aria-label="User panel"
                >
                  {userData?.avatar?.url ? (
                    <img
                      src={userData.avatar.url}
                      alt={userData?.username || "User"}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-semibold">
                      {(userData?.username || "U")[0].toUpperCase()}
                    </span>
                  )}
                </Link>
              </li>
            )}

            {/* Theme toggle */}
            <li>
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                title={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="btn-glass flex h-9 w-9 items-center justify-center rounded-full"
              >
                {theme === "dark" ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
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
                    strokeWidth="1.6"
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
                    <path d="M4.93 19.07l1.41-1.41" />
                    <path d="M17.66 6.34l1.41-1.41" />
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
