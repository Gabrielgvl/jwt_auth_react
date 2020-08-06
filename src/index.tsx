// @ts-ignore
import React, {createContext, useContext, useReducer} from 'react';

import {
    handleLogIn,
    handleLogOut,
    handleSetUserInfo,
    LOG_IN,
    LOG_OUT,
    SET_USER_INFO,
} from './authStore';

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

export interface JwtAuthInterface {
    children: Node,
    keyPrefix: String,
    jwtToken?: String,
}

export const JwtAuthProvider: React.FC<JwtAuthInterface> = ({ children, keyPrefix, jwtToken }) => {
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

export interface UseJwtAuthReturn {
    setUserInfo: () => void,
    logIn: (token) => void,
    logOut: () => void,
    handleLogin: (token, effect?) => void,
    isLoggedIn: Boolean,
    isLogin: Boolean,
    userInfo: {},
}

const useJwtAuth: React.FC = () : UseJwtAuthReturn => {
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
