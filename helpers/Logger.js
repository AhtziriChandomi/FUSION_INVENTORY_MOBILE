const isDev = process.env.NODE_ENV === 'development'

export const logger = (msg = "", data = null) => {
    if(isDev){
        if (data !== null) {
            console.log(`[DEBUG] ${msg}`, data);
        } else {
            console.log(`[DEBUG] ${msg}`);
        }
    }
}