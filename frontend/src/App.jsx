import { useEffect, useState } from "react"
import {useDispatch} from "react-redux"

import authService from "./psappwrite/auth";
import { login,logout } from "./store/authSlice";
import { Footer, Header } from "./components";
import { Outlet } from "react-router";
function App() {

  const [loading,setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("bp-theme");
    return saved === "light" ? "light" : "dark";
  });
  const dispatch = useDispatch();
   useEffect(()=>{
    authService.getCurrentUser()
    .then(userData=>{
      if(userData){
        dispatch(login({userData}));
      }
      else{
        dispatch(logout()); 
      }
    })
    .finally(()=>setLoading(false));
   },[])
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("bp-theme", theme);
  }, [theme]);
  return !loading? (
      <div className="app-shell min-h-screen text-slate-100">
        <div className="relative z-10 flex min-h-screen flex-col">
          <Header theme={theme} setTheme={setTheme}></Header>
          <main className="flex-1 py-10">
            <Outlet></Outlet>
          </main>
          <Footer></Footer>
        </div>
      </div>
    ): null
  
}

export default App
