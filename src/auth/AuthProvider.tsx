import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { ILoginUserDetails } from '../interfaces/User';


type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  setLoginUser: (info: string) => void;
  getLoginUser: () => string | null;
  getLoginUserInfo: () => ILoginUserDetails | null;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );

  const [loginDetails, setLoginDetails] = useState<string | null>(
    sessionStorage.getItem("loginDetails")
  );

  const login = (newToken: string) => {
    sessionStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const setLoginUser = (info: string) => {
    sessionStorage.setItem("loginDetails", info);
    setLoginDetails(info);
  };

  const getLoginUser = () => {
    return loginDetails;
  };

  const getLoginUserInfo = () => {
    return loginDetails
      ? (JSON.parse(loginDetails) as ILoginUserDetails)
      : null;
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.clear();
    setToken(null);
    setLoginDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        setLoginUser,
        getLoginUser,
        getLoginUserInfo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
