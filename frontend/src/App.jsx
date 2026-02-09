import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router"

import authService from "./psappwrite/auth"
import { login, logout } from "./store/authSlice"
import { Footer, Header } from "./components"

function App() {
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("bp-theme")
    return saved === "light" ? "light" : "dark"
  })

  const dispatch = useDispatch()

  useEffect(() => {
    authService
      .getCurrentUser()
      .then(userData => {
        if (userData) dispatch(login({ userData }))
        else dispatch(logout())
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("bp-theme", theme)
  }, [theme])

  if (loading) return null

  return (
    <div className="min-h-screen bg-app text-app">
      <div className="flex min-h-screen flex-col">
        <Header theme={theme} setTheme={setTheme} />

        <main className="flex-1">
          {/* page container */}
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-8">
            <Outlet />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
