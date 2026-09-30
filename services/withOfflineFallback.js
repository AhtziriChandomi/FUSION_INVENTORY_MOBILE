export const withOfflineFallback = async ({ isOfflineMode, online, offline }) => {
  if (isOfflineMode) return await offline();

  try {
    return await online();
  } catch (e) {
    // si falla la API aunque haya internet, cae a SQLite
    return await offline();
  }
};
