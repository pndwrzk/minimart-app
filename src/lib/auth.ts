export const isLoggedIn = (): boolean => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    return !!token; 
  }
  return false;
};