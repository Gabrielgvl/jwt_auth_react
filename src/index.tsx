import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import jwtDecode from 'jwt-decode';

export interface UseJwtAuthReturn<T = any> {
  logIn: (token: string) => void,
  logOut: () => void,
  token: string | null,
  isLoggedIn: boolean,
  userInfo?: T,
}

const defaultState: UseJwtAuthReturn = {
  logIn: () => null,
  logOut: () => null,
  token: null,
  isLoggedIn: false,
};

const JwtAuthContext = createContext<UseJwtAuthReturn>(defaultState);
export interface JwtAuthInterface {
  children: React.ReactNode,
  keyPrefix: string,
}

export const JwtAuthProvider: React.FC<JwtAuthInterface> = (
  { children, keyPrefix },
) => {
  const [token, setToken] = useState(localStorage.getItem(keyPrefix));
  const [isLoggedIn, setLoggedIn] = useState(!!localStorage.getItem(keyPrefix));
  const [userInfo, setUserInfo] = useState(() => (token ? jwtDecode(token) : {}));

  const logIn = useCallback((accessToken: string) => {
    localStorage.setItem(keyPrefix, accessToken);
    setToken(accessToken);
    setLoggedIn(true);
    setUserInfo(jwtDecode(accessToken));
  }, [keyPrefix]);

  const logOut = useCallback(() => {
    localStorage.removeItem(keyPrefix);
    setToken(null);
    setLoggedIn(false);
  }, [keyPrefix]);

  const initialState = {
    logIn,
    logOut,
    token,
    isLoggedIn,
    userInfo,
  };
  return (
    <JwtAuthContext.Provider value={initialState}>
      {children}
    </JwtAuthContext.Provider>
  );
};

function useJWT<T = any>(): UseJwtAuthReturn<T> {
  return useContext(JwtAuthContext);
}

export default useJWT;
