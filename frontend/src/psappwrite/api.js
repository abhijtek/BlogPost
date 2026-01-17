import axios from "axios";
import conf from "../conf/conf";
const api = axios.create({
    baseURL:`${conf.backendBaseUrl}/api/v1`,
    withCredentials: true,
    headers:{
        "Content-Type":"application/json"
    }
});

export default api;