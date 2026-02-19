import React from "react"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"
import Logo from "../../Logo.jsx"

function Footer() {
  const userData = useSelector((state) => state.auth.userData)
  const isAdmin = userData?.role === "admin"

  return (
    <footer className="py-8">
      <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="surface-card rounded-3xl p-6 sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr_1fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Logo width="72px" />
                <div>
                  <p className="text-base font-semibold text-app">BlogPost</p>
                  <p className="text-xs text-muted">Publish, review, grow</p>
                </div>
              </div>
              <p className="max-w-md text-sm text-muted">
                Build and review full-length posts with rich media, structured tags, and smooth publishing workflow.
              </p>
              <p className="text-xs text-muted">Copyright 2026 BlogPost. All rights reserved.</p>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">Explore</h3>
              <ul className="space-y-2 text-sm">
                <li><Link className="interactive menu-link rounded px-1 py-0.5" to="/">Home</Link></li>
                <li><Link className="interactive menu-link rounded px-1 py-0.5" to="/all-posts">All Posts</Link></li>
                {!isAdmin && (
                  <li><Link className="interactive menu-link rounded px-1 py-0.5" to="/add-post">Write</Link></li>
                )}
              </ul>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted">Account</h3>
              <ul className="space-y-2 text-sm">
                <li><Link className="interactive menu-link rounded px-1 py-0.5" to="/panel">User Panel</Link></li>
                <li><Link className="interactive menu-link rounded px-1 py-0.5" to="/login">Login</Link></li>
                <li><Link className="interactive menu-link rounded px-1 py-0.5" to="/signup">Signup</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
