import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '../../Logo.jsx'
function Footer() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-12">
      <div className="relative z-10 mx-auto max-w-7xl px-4">
        <div className="glass-card mesh-border rounded-3xl px-6 py-10">
          <div className="-m-6 flex flex-wrap">
            <div className="w-full p-6 md:w-1/2 lg:w-5/12">
              <div className="flex h-full flex-col justify-between gap-6">
                <div className="inline-flex items-center gap-3">
                  <Logo width="90px" />
                  <span className="text-lg font-semibold text-slate-100">BlogPost</span>
                </div>
                <p className="text-sm text-slate-300">
                  &copy; Copyright 2026. All Rights Reserved.
                </p>
              </div>
            </div>
            <div className="w-full p-6 md:w-1/2 lg:w-2/12">
              <div className="h-full">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Company
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Affiliate Program
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Press Kit
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full p-6 md:w-1/2 lg:w-2/12">
              <div className="h-full">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Support
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Account
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Help
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Customer Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full p-6 md:w-1/2 lg:w-3/12">
              <div className="h-full">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                  Legals
                </h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Terms &amp; Conditions
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link className="font-medium text-slate-200 hover:text-white" to="/">
                      Licensing
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Footer
