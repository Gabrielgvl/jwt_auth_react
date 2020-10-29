import React from 'react';
export interface JwtAuthInterface {
    children: React.ReactNode;
    keyPrefix: string;
}
export declare const JwtAuthProvider: React.FC<JwtAuthInterface>;
export interface UseJwtAuthReturn {
    setUserInfo: () => void;
    logIn: (token: any) => void;
    logOut: () => void;
    token: string | null;
    handleLogin: (token: any, effect?: any) => void;
    isLoggedIn: Boolean;
    isLogin: Boolean;
    userInfo: {};
}
declare const useJwtAuth: () => UseJwtAuthReturn;
export default useJwtAuth;
