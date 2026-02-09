import React from "react"
import { Link } from "react-router-dom"
import Logo from "../../Logo.jsx"

function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto max-w-7xl px-4">
        <div className="glass-card rounded-2xl p-6">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1fr_1fr]">
            {/* Brand */}
            <div className="flex flex-col justify-between gap-6">
              <div className="flex items-center gap-3">
                <Logo width="72px" />
                <span className="text-base font-semibold text-app">
                  BlogPost
                </span>
              </div>
              <p className="text-sm text-muted">
                © 2026 BlogPost. All rights reserved.
              </p>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Company
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Features
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Affiliate
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Press
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Support
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Account
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Help
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Support Center
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Legal
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link className="text-muted hover:text-app" to="/">
                    Licensing
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
