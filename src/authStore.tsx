import jwtDecode from 'jwt-decode';

export const SET_USER_INFO = 'SET_USER_INFO';
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';

export function handleSetUserInfo(state) {
  const token = localStorage.getItem(state.token);
  const { payload: userInfo } = jwtDecode(token);
  return {
    ...state,
    userInfo: { ...userInfo },
  };
}

export function handleLogIn(state, { token }) {
  const { payload: userInfo } = jwtDecode(token);
  localStorage.setItem(state.token, token);
  return {
    ...state,
    isLoggedIn: true,
    isLogin: true,
    userInfo: { ...userInfo },
  };
}

export function handleLogOut(state) {
  localStorage.removeItem(state.token);
  return {
    ...state,
    isLoggedIn: false,
  };
}
