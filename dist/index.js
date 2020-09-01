Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */
var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill(input) {
  var str = String(input).replace(/=+$/, '');

  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }

  for ( // initialize result and counters
  var bc = 0, bs, buffer, idx = 0, output = ''; // get next character
  buffer = str.charAt(idx++); // character found in table? initialize bit storage and add its ascii value;
  ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, // and if not first of each 4 characters,
  // convert the first 8 bits to one ascii character
  bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }

  return output;
}

var atob = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();

    if (code.length < 2) {
      code = '0' + code;
    }

    return '%' + code;
  }));
}

var base64_url_decode = function (str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");

  switch (output.length % 4) {
    case 0:
      break;

    case 2:
      output += "==";
      break;

    case 3:
      output += "=";
      break;

    default:
      throw "Illegal base64url string!";
  }

  try {
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

var lib = function (token, options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;

  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

var InvalidTokenError_1 = InvalidTokenError;
lib.InvalidTokenError = InvalidTokenError_1;

const SET_USER_INFO = 'SET_USER_INFO';
const LOG_IN = 'LOG_IN';
const LOG_OUT = 'LOG_OUT';
const GET_TOKEN = 'GET_TOKEN';
function getToken(state) {
    return localStorage.getItem(state.token);
}
function handleSetUserInfo(state) {
    const token = getToken(state);
    const { payload: userInfo } = lib(token);
    return Object.assign(Object.assign({}, state), { userInfo: Object.assign({}, userInfo) });
}
function handleLogIn(state, { token }) {
    const { payload: userInfo } = lib(token);
    localStorage.setItem(state.token, token);
    return Object.assign(Object.assign({}, state), { isLoggedIn: true, isLogin: true, userInfo: Object.assign({}, userInfo) });
}
function handleLogOut(state) {
    localStorage.removeItem(state.token);
    return Object.assign(Object.assign({}, state), { isLoggedIn: false });
}

const initialState = (token = '') => ({
    isLoggedIn: !!localStorage.getItem(token),
    userInfo: null,
    isLogin: false,
    cache: {},
    token,
});
const JwtAuthContext = React.createContext(initialState());
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
const JwtAuthProvider = ({ children, keyPrefix, jwtToken }) => {
    const [state, dispatch] = React.useReducer(jwtAuthReducer, initialState(`${keyPrefix}:${jwtToken}`));
    return (
    // @ts-ignore
    React__default.createElement(JwtAuthContext.Provider, { value: [state, dispatch] }, children));
};
JwtAuthProvider.defaultProps = {
    jwtToken: 'token',
};
const useJwtAuth = () => {
    const [state, dispatch] = React.useContext(JwtAuthContext);
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
    const handleLogin = (token, effect = () => { }) => __awaiter(void 0, void 0, void 0, function* () {
        logIn(token);
        effect();
    });
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

exports.JwtAuthProvider = JwtAuthProvider;
exports.default = useJwtAuth;
//# sourceMappingURL=index.js.map
