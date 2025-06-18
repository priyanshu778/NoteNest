import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const authContext = createContext();

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("token", userData.token);  
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axios.get("http://localhost:5000/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data.success) {
            setUser(response.data.user);  
          } else {
            logout();  
          }
        } catch (err) {
          console.error("Error verifying token", err);
          logout();  
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <authContext.Provider value={{ user, login, logout }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => useContext(authContext);
export default ContextProvider;