import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("current-user"));
    if (userData) {
      setCurrentUser(userData);
      setProfileComplete(userData.profileComplete || false);
    }
  }, []);

  const updateProfileStatus = (status) => {
    setProfileComplete(status);
    if (currentUser) {
      sessionStorage.setItem("current-user", JSON.stringify({
        ...currentUser,
        profileComplete: status
      }));
    }
  };

  const login = (userData) => {
    setCurrentUser(userData);
    setProfileComplete(userData.profileComplete || false);
    sessionStorage.setItem("current-user", JSON.stringify(userData));
  };

  const logout = () => {
    setCurrentUser(null);
    setProfileComplete(false);
    sessionStorage.removeItem("current-user");
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      profileComplete,
      updateProfileStatus,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);