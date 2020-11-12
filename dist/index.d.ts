import React from 'react';
export interface JwtAuthInterface {
    children: React.ReactNode;
    keyPrefix: string;
}
export declare const JwtAuthProvider: React.FC<JwtAuthInterface>;
export interface UseJwtAuthReturn<T> {
    logIn: (token: string) => void;
    logOut: () => void;
    token: string | null;
    isLoggedIn: boolean;
    userInfo: T;
}
declare function useJWT<T = any>(): UseJwtAuthReturn<T>;
export default useJWT;
