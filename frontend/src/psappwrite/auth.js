import conf from "../conf/conf";
import api from "./api";
import axios from "axios";

class AuthService {
  async createAccount({ email, username, password }) {
    try {
      const userAccount = await api.post("/auth/register", {
         email,
        username,
        password,
      });
      console.log("this received while creating account",userAccount);
      if (userAccount) return this.login({ email, password });
    } catch (error) {
      console.log(error.status,error.message,"could not create account");
      throw new Error("Unable to create account");
    }
  }

  async login({ email, password }) {
try {
      const res = await api.post("/auth/login", { email, password });
      console.log(res);
      return res.data.data;
} catch (error) {
  console.log(error?.status, error?.message, "login failed");
  throw new Error("Invalid email or password");
}
  }

  async getCurrentUser() {
try {
      const res = await api.get("/auth/current-user");
      console.log("this is the current user fetched directly from axios",res.data.data);
      return res.data.data;
} catch (error) {
  console.log(error.status,error.message,"could not get current user")
}
  }

  async logout() {
try {
      const res = await api.post("/auth/logout");
      console.log("user logges out",res);
      return res;
} catch (error) {
  console.log(error.status,error.message,"logout failed")
}
  }
}
const authService = new AuthService();
export default authService;
