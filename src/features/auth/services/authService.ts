export const login = (
  username: string,
  password: string
): boolean => {
  const dummyUser = {
    username: "admin",
    password: "12345",
  };

  if (
    username === dummyUser.username &&
    password === dummyUser.password
  ) {
    localStorage.setItem("isLoggedIn", "true");
    return true;
  }

  return false;
};

export const logout = () => {
  localStorage.removeItem("isLoggedIn");
};

export const isAuthenticated = () => {
  return localStorage.getItem("isLoggedIn") === "true";
};