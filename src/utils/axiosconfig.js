export const getAxiosConfig = () => {
  const user = localStorage.getItem("user");
  const token = user ? JSON.parse(user).accessToken : "";

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    timeout: 10000,
  };
};
