import React from 'react';
export interface UseJwtAuthReturn<T = any> {
    logIn: (token: string) => void;
    logOut: () => void;
    token: string | null;
    isLoggedIn: boolean;
    userInfo?: T;
}
export interface JwtAuthInterface {
    children: React.ReactNode;
    keyPrefix: string;
}
export declare const JwtAuthProvider: React.FC<JwtAuthInterface>;
declare function useJWT<T = any>(): UseJwtAuthReturn<T>;
export default useJWT;
