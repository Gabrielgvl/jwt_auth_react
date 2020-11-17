import jwtDecode from 'jwt-decode';

export const GET_USER_INFO = 'SET_USER_INFO';
export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';
export const GET_TOKEN = 'GET_TOKEN';

export function handleLogIn(state, { token }) {
  const { payload: userInfo } = jwtDecode(token);
  localStorage.setItem(state.keyPrefix, token);
  return {
    ...state,
    isLoggedIn: true,
    userInfo: { ...userInfo },
  };
}

export function handleLogOut(state) {
  localStorage.removeItem(state.keyPrefix);
  return {
    ...state,
    isLoggedIn: false,
  };
}
