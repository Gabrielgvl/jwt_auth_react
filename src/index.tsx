import React, { createContext, useContext, useReducer } from 'react';

import {
  handleLogIn,
  handleLogOut,
  handleSetUserInfo,
  LOG_IN,
  LOG_OUT,
  SET_USER_INFO,
  GET_TOKEN, getToken,
} from './authStore';

interface InitialInterface {
  isLoggedIn: Boolean,
  userInfo: Object | null,
  isLogin: Boolean,
  cache: Object,
  token: String,
}

const initialState = (token = '') => ({
  isLoggedIn: !!localStorage.getItem(token),
  userInfo: null,
  isLogin: false,
  cache: {},
  token,
});

const JwtAuthContext = createContext<InitialInterface>(initialState());

const jwtAuthReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return handleSetUserInfo(state);
    case LOG_IN:
      return handleLogIn(state, action.payload);
    case LOG_OUT:
      return handleLogOut(state);
    case GET_TOKEN:
      return getToken(state);
    default:
      return state;
  }
};

interface JwtAuthInterface {
    children: React.ReactNode,
    keyPrefix: String,
    jwtToken?: String,
}

export const JwtAuthProvider: React.FC<JwtAuthInterface> = ({ children, keyPrefix, jwtToken }) => {
  const [state, dispatch] = useReducer(jwtAuthReducer, initialState(`${keyPrefix}:${jwtToken}`));

  return (
  // @ts-ignore
    <JwtAuthContext.Provider value={[state, dispatch]}>
      {children}
    </JwtAuthContext.Provider>
  );
};

JwtAuthProvider.defaultProps = {
  jwtToken: 'token',
};

interface UseJwtAuthReturn {
    setUserInfo: () => void,
    logIn: (token) => void,
    logOut: () => void,
    token: String | null,
    handleLogin: (token, effect?) => void,
    isLoggedIn: Boolean,
    isLogin: Boolean,
    userInfo: {},
}

const useJwtAuth: () => UseJwtAuthReturn = () : UseJwtAuthReturn => {
  const [state, dispatch] = useContext<any>(JwtAuthContext);

  const setUserInfo = () => {
    dispatch({
      type: SET_USER_INFO,
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

  // const getToken = () => {
  //   dispatch({
  //     type: GET_TOKEN,
  //   });
  // };

  return {
    setUserInfo,
    logIn,
    logOut,
    handleLogin,
    token: localStorage.getItem(state.token),
    isLoggedIn: state.isLoggedIn,
    isLogin: state.isLogin,
    userInfo: state.userInfo,
  };
};

export default useJwtAuth;
