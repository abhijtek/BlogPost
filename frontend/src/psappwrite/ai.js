import api from "./api.js";

export const chatBot = async(prompt)=>{
    
    try {
        
        if(!prompt.trim()){
            throw Error({message:"error fetching data"});
        }
        const body = {
            prompt: prompt
        }
        const HFres = await api.post("ai/generate",{
            prompt:prompt
        });
        console.log("here is the raw json received",HFres);

        return HFres?.data?.data?.content;
    } catch (error) {
        console.log(error)
        return "error generating result via bot";
    }
    

}