export const withOfflineFallback = async ({ isOfflineMode, online, offline }) => {
    if(isOfflineMode) return await offline();

    try{
        return await online();
    }catch(e){
        return await offline();
    }
}