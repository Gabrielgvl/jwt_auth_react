Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);

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

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
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

var base64_url_decode = function(str) {
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

  try{
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

var lib = function (token,options) {
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

const defaultState = {
    logIn: () => null,
    logOut: () => null,
    token: null,
    isLoggedIn: false,
};
const JwtAuthContext = React.createContext(defaultState);
const JwtAuthProvider = ({ children, keyPrefix }) => {
    const [token, setToken] = React.useState(localStorage.getItem(keyPrefix));
    const [isLoggedIn, setLoggedIn] = React.useState(!!localStorage.getItem(keyPrefix));
    const [userInfo, setUserInfo] = React.useState(() => (token ? lib(token) : {}));
    const logIn = React.useCallback((accessToken) => {
        localStorage.setItem(keyPrefix, accessToken);
        setToken(accessToken);
        setLoggedIn(true);
        setUserInfo(lib(accessToken));
    }, [keyPrefix]);
    const logOut = React.useCallback(() => {
        localStorage.removeItem(keyPrefix);
        setToken(null);
        setLoggedIn(false);
    }, [keyPrefix]);
    const initialState = {
        logIn,
        logOut,
        token,
        isLoggedIn,
        userInfo,
    };
    return (React__default.createElement(JwtAuthContext.Provider, { value: initialState }, children));
};
function useJWT() {
    return React.useContext(JwtAuthContext);
}

exports.JwtAuthProvider = JwtAuthProvider;
exports.default = useJWT;
//# sourceMappingURL=index.js.map
