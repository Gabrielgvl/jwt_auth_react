export declare const GET_USER_INFO = "SET_USER_INFO";
export declare const LOG_IN = "LOG_IN";
export declare const LOG_OUT = "LOG_OUT";
export declare const GET_TOKEN = "GET_TOKEN";
export declare function handleSetUserInfo(state: any): any;
export declare function handleLogIn(state: any, { token }: {
    token: any;
}): any;
export declare function handleLogOut(state: any): any;
