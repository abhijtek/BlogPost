import { useEffect, useState } from "react"
import {useDispatch} from "react-redux"

import authService from "./psappwrite/auth";
import { login } from "./store/authSlice";
import { Footer, Header } from "./components";
function App() {

  const [loading,setLoading] = useState(true);
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
  return !loading? (
      <div className="min-h-screen flex flex-wrap content-between bg-gray-400">
        <div>
        <Header></Header>
        <main>
          {/* {outlet} */}
        </main>
        <Footer></Footer>
        </div>
        </div>
    ): null
  
}

export default App
