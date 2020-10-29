import React, { createContext, useContext, useReducer } from 'react';
import jwtDecode from 'jwt-decode';
import {
  handleLogIn,
  handleLogOut,
  handleSetUserInfo,
  LOG_IN,
  LOG_OUT,
  GET_USER_INFO,
} from './authStore';

interface InitialInterface {
  isLoggedIn: Boolean,
  userInfo: Object | null,
  isLogin: Boolean,
  cache: Object,
  token: string,
}

const initialState = (token = "") => ({
  isLoggedIn: !!localStorage.getItem(token),
  userInfo: null,
  isLogin: false,
  cache: {},
  token,
});

const JwtAuthContext = createContext<InitialInterface>(initialState());

const jwtAuthReducer = (state, action) => {
  switch (action.type) {
    case GET_USER_INFO:
      return handleSetUserInfo(state);
    case LOG_IN:
      return handleLogIn(state, action.payload);
    case LOG_OUT:
      return handleLogOut(state);
    default:
      return state;
  }
};

export interface JwtAuthInterface {
    children: React.ReactNode,
    keyPrefix: string,
}

export const JwtAuthProvider: React.FC<JwtAuthInterface> = ({ children, keyPrefix }) => {
  const [state, dispatch] = useReducer(jwtAuthReducer, initialState(keyPrefix))

  return (
  // @ts-ignore
    <JwtAuthContext.Provider value={[state, dispatch]}>
      {children}
    </JwtAuthContext.Provider>
  );
};

export interface UseJwtAuthReturn {
    setUserInfo: () => void,
    logIn: (token) => void,
    logOut: () => void,
    token: string | null,
    handleLogin: (token, effect?) => void,
    isLoggedIn: Boolean,
    isLogin: Boolean,
    userInfo: {},
}

const useJwtAuth: () => UseJwtAuthReturn = () : UseJwtAuthReturn => {
  const [state, dispatch] = useContext<any>(JwtAuthContext);

  const setUserInfo = () => {
    dispatch({
      type: GET_USER_INFO,
    });
  };

  const logIn = (token) => {
    dispatch({
      type: LOG_IN,
      payload: {
        token,
      },
    });
  };

  const logOut = () => {
    dispatch({
      type: LOG_OUT,
    });
  };

  const handleLogin = async (token, effect = () => {}) => {
    logIn(token);
    effect();
  };

  const getUserInfo = () => {
    const token = localStorage.getItem(state.token);
    if (token) {
      return jwtDecode(token)
    }
  }


  return {
    setUserInfo,
    logIn,
    logOut,
    handleLogin,
    token: localStorage.getItem(state.token),
    isLoggedIn: state.isLoggedIn,
    isLogin: state.isLogin,
    userInfo: getUserInfo(),
  };
};

export default useJwtAuth;
