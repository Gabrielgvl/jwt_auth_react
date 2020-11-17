import React, {
  createContext,
  useCallback, useReducer,
} from 'react';
import jwtDecode from 'jwt-decode';
import {
  handleLogIn, handleLogOut, LOG_IN, LOG_OUT,
} from 'authStore';

// interface InitialInterface<T> {
//   isLoggedIn: Boolean,
//   userInfo: T | null,
//   token: string,
// }

const initialState = (keyPrefix = '') => ({
  isLoggedIn: !!localStorage.getItem(keyPrefix),
  userInfo: null,
  keyPrefix,
});

const jwtAuthReducer = (state, action) => {
  switch (action.type) {
    case LOG_IN:
      return handleLogIn(state, action.payload);
    case LOG_OUT:
      return handleLogOut(state);
    default:
      return state;
  }
};

const JwtAuthContext = createContext({ keyPrefix: 'token' });

export interface JwtAuthInterface {
  children: React.ReactNode,
  keyPrefix: string,
}

export const JwtAuthProvider: React.FC<JwtAuthInterface> = ({ children, keyPrefix }) => {
  const [state, dispatch] = useReducer(jwtAuthReducer, initialState(keyPrefix));

  return (
  // @ts-ignore
    <JwtAuthContext.Provider value={[state, dispatch]}>
      {children}
    </JwtAuthContext.Provider>
  );
};

export interface UseJwtAuthReturn<T> {
  logIn: (token: string) => void,
  logOut: () => void,
  token: string | null,
  isLoggedIn: boolean,
  userInfo: T,
}

function useJWT<T = any>(keyPrefix): UseJwtAuthReturn<T> {
  const [state, dispatch] = useReducer(jwtAuthReducer, initialState(keyPrefix));

  const logIn = useCallback((token: string) => {
    dispatch({
      type: LOG_IN,
      payload: {
        token,
      },
    });
  }, []);

  const logOut = useCallback(() => {
    dispatch({
      type: LOG_OUT,
    });
  }, []);

  const getUserInfo = useCallback(() => {
    const token = localStorage.getItem(keyPrefix);
    if (token) {
      try {
        return jwtDecode(token);
      } catch (e) {
        console.error(`Could not parse token: ${token}`);
      }
    }
  }, [keyPrefix]);

  return {
    logIn,
    logOut,
    token: localStorage.getItem(keyPrefix),
    isLoggedIn: state.isLoggedIn,
    userInfo: state.userInfo,
  };
}

export default useJWT;
