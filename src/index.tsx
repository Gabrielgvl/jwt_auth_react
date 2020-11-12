import React, {createContext, useContext,} from 'react';
import jwtDecode from 'jwt-decode';

interface InitialInterface {
  keyPrefix: string,
}

const jwtAuthContext = createContext<InitialInterface>({ keyPrefix: 'jwtToken' });

export interface JwtAuthInterface {
  children: React.ReactNode,
  keyPrefix: string,
}

export const JwtAuthProvider: React.FC<JwtAuthInterface> = (
    { children, keyPrefix },
) => (
    <jwtAuthContext.Provider value={{ keyPrefix }}>
      {children}
    </jwtAuthContext.Provider>
);

export interface UseJwtAuthReturn<T> {
  logIn: (token: string) => void,
  logOut: () => void,
  token: string | null,
  isLoggedIn: boolean,
  userInfo: T,
}

function useJWT<T = any>(): UseJwtAuthReturn<T> {
  const { keyPrefix } = useContext(jwtAuthContext);

  const logIn = (token: string) => {
    localStorage.setItem(keyPrefix, token);
  };

  const logOut = () => {
    localStorage.removeItem(keyPrefix);
  };

  const getUserInfo = () => {
    const token = localStorage.getItem(keyPrefix);
    if (token){
      try {
        return jwtDecode(token)
      } catch (e) {
        console.error("Could not parse token: " + token)
      }
    }
  };

  return {
    logIn,
    logOut,
    token: localStorage.getItem(keyPrefix),
    isLoggedIn: !!localStorage.getItem(keyPrefix),
    userInfo: getUserInfo(),
  };
}

export default useJWT;
