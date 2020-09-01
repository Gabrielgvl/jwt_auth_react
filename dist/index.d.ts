import React from 'react';
interface JwtAuthInterface {
    children: Node;
    keyPrefix: String;
    jwtToken?: String;
}
export declare const JwtAuthProvider: React.FC<JwtAuthInterface>;
interface UseJwtAuthReturn {
    setUserInfo: () => void;
    logIn: (token: any) => void;
    logOut: () => void;
    token: String | null;
    handleLogin: (token: any, effect?: any) => void;
    isLoggedIn: Boolean;
    isLogin: Boolean;
    userInfo: {};
}
declare const useJwtAuth: () => UseJwtAuthReturn;
export default useJwtAuth;
