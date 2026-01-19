import conf from "../conf/conf";
import api from "./api";
import axios from "axios"

 class AuthService{
   async createAccount({email,username,password}){
     const userAccount =  await api.post("/register",{
        email:email,
        username:username,
        password:password
     })
     console.log(userAccount);
     if(userAccount)return this.login({email,password});
   }

   async login({email,password}){
    const res = await api.post("/login",{email,password});
     console.log(res);
     return res;
   } 
   
   async getCurrentUser(){
    const res  = await api.get("/current-user");
    console.log(res);
    return res;
   }

   async logout(){
    const res = await api.get("/logout")
     console.log(res);
    return res;
   }
}
 const authService = new AuthService();
 export default authService;