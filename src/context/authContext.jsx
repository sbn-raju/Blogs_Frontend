import React, { createContext, useState } from 'react';


// Create the Auth Context
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  const userData = JSON.parse(localStorage.getItem('user')) || {
    isAuthenticated: false,
    user: null,
    token: null,
  }
  const [authState, setAuthState] = useState({
    isAuthenticated: userData.isAuthenticated,
    user: userData.user,
    token: userData.token,
  });

  // Login function
  const login = (user, token) => {
    console.log("Authentication Login", user, token)
    setAuthState({
      isAuthenticated: true,
      user,
      token,
    });
    
  };

  // Logout function
  const logout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    localStorage.removeItem('user');
  };

  localStorage.setItem('user', JSON.stringify(authState));
  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
