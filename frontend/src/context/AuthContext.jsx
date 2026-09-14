import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const TOKEN_STORAGE_KEY = "aadityas-midway-token";
const USER_STORAGE_KEY = "aadityas-midway-user";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        USER_STORAGE_KEY,
        JSON.stringify(user)
      );
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  const login = (loginData) => {
    const receivedToken = loginData?.data?.token;
    const receivedUser = loginData?.data?.user;

    if (!receivedToken || !receivedUser) {
      throw new Error("Invalid login response");
    }

    setToken(receivedToken);
    setUser(receivedUser);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
    }),
    [token, user, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};

export default AuthContext;