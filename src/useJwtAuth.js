import React, {createContext, useContext, useEffect, useReducer} from 'react';
import {
  handleLogIn,
  handleLogOut,
  handleSetUserInfo,
  LOG_IN,
  LOG_OUT,
  SET_USER_INFO,
} from './authStore';
import PropTypes from 'prop-types';

const JwtAuthContext = createContext();

const initialState = (token) => ({
  isLoggedIn: !!localStorage.getItem(token),
  userInfo: null,
  isLogin: false,
  cache: {},
  token,
});

const jwtAuthReducer = (state, action) => {
  switch (action.type) {
    case SET_USER_INFO:
      return handleSetUserInfo(state);
    case LOG_IN:
      return handleLogIn(state, action.payload);
    case LOG_OUT:
      return handleLogOut(state);
    default:
      return state;
  }
};

/* Export a component to provide the context to its children. This is used in our _app.js file */

export const JwtAuthProvider = ({ children, keyPrefix, jwtToken }) => {
  const [state, dispatch] = useReducer(jwtAuthReducer, initialState(`${keyPrefix}:${jwtToken}`));

  return (
    <JwtAuthContext.Provider value={[state, dispatch]}>
      {children}
    </JwtAuthContext.Provider>
  );
};

JwtAuthProvider.defaultProps = {
  jwtToken: 'token',
}

JwtAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  keyPrefix: PropTypes.string.isRequired,
  jwtToken: PropTypes.string,
}

const useJwtAuth = () => {
  const [state, dispatch] = useContext(JwtAuthContext);

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

  return {
    setUserInfo,
    logIn,
    logOut,
    handleLogin,
    isLoggedIn: state.isLoggedIn,
    isLogin: state.isLogin,
    userInfo: state.userInfo,
  };
};

export default useJwtAuth;
