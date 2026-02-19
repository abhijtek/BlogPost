import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router"

import authService from "./psappwrite/auth"
import { authChecked, login, logout } from "./store/authSlice"
import { Footer, Header } from "./components"

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("bp-theme")
    return saved === "light" ? "light" : "dark"
  })

  const dispatch = useDispatch()

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }))
        else dispatch(logout())
      })
      .finally(() => dispatch(authChecked()))
  }, [dispatch])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem("bp-theme", theme)
  }, [theme])

  return (
    <div className="app-shell min-h-screen bg-app text-app">
      <div className="flex min-h-screen flex-col">
        <Header theme={theme} setTheme={setTheme} />

        <main className="site-main flex-1">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  )
}

export default App
