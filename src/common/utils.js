export const isUserLoggedIn = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const checkTokenExpired = (error) => {
  return error.includes("token expired");
};
