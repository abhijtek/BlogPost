export const getTodayKey = ()=>{
    return new Date().toJSON().slice(0,10);
}