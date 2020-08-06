Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var jwtDecode = _interopDefault(require('jwt-decode'));
var PropTypes = _interopDefault(require('prop-types'));

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var SET_USER_INFO = 'SET_USER_INFO';
var LOG_IN = 'LOG_IN';
var LOG_OUT = 'LOG_OUT';
function handleSetUserInfo(state) {
  var token = localStorage.getItem(state.token);

  var _jwtDecode = jwtDecode(token),
      userInfo = _jwtDecode.payload;

  return _objectSpread2(_objectSpread2({}, state), {}, {
    userInfo: _objectSpread2({}, userInfo)
  });
}
function handleLogIn(state, _ref) {
  var token = _ref.token;

  var _jwtDecode2 = jwtDecode(token),
      userInfo = _jwtDecode2.payload;

  localStorage.setItem(state.token, token);
  return _objectSpread2(_objectSpread2({}, state), {}, {
    isLoggedIn: true,
    isLogin: true,
    userInfo: _objectSpread2({}, userInfo)
  });
}
function handleLogOut(state) {
  localStorage.removeItem(state.token);
  return _objectSpread2(_objectSpread2({}, state), {}, {
    isLoggedIn: false
  });
}

var JwtAuthContext = React.createContext();

var initialState = function initialState(token) {
  return {
    isLoggedIn: !!localStorage.getItem(token),
    userInfo: null,
    isLogin: false,
    cache: {},
    token: token
  };
};

var jwtAuthReducer = function jwtAuthReducer(state, action) {
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


var JwtAuthProvider = function JwtAuthProvider(_ref) {
  var children = _ref.children,
      keyPrefix = _ref.keyPrefix,
      jwtToken = _ref.jwtToken;

  var _useReducer = React.useReducer(jwtAuthReducer, initialState("".concat(keyPrefix, ":").concat(jwtToken))),
      _useReducer2 = _slicedToArray(_useReducer, 2),
      state = _useReducer2[0],
      dispatch = _useReducer2[1];

  return React__default.createElement(JwtAuthContext.Provider, {
    value: [state, dispatch]
  }, children);
};
JwtAuthProvider.defaultProps = {
  jwtToken: 'token'
};
JwtAuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
  keyPrefix: PropTypes.string.isRequired,
  jwtToken: PropTypes.string
};

var useJwtAuth = function useJwtAuth() {
  var _useContext = React.useContext(JwtAuthContext),
      _useContext2 = _slicedToArray(_useContext, 2),
      state = _useContext2[0],
      dispatch = _useContext2[1];

  var setUserInfo = function setUserInfo() {
    dispatch({
      type: SET_USER_INFO
    });
  };

  var logIn = function logIn(token) {
    dispatch({
      type: LOG_IN,
      payload: {
        token: token
      }
    });
  };

  var logOut = function logOut() {
    dispatch({
      type: LOG_OUT
    });
  };

  var handleLogin = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(token) {
      var effect,
          _args = arguments;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              effect = _args.length > 1 && _args[1] !== undefined ? _args[1] : function () {};
              logIn(token);
              effect();

            case 3:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function handleLogin(_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  return {
    setUserInfo: setUserInfo,
    logIn: logIn,
    logOut: logOut,
    handleLogin: handleLogin,
    isLoggedIn: state.isLoggedIn,
    isLogin: state.isLogin,
    userInfo: state.userInfo
  };
};

var index = {
  JwtAuthProvider: JwtAuthProvider,
  useJwtAuth: useJwtAuth
};

exports.default = index;
//# sourceMappingURL=index.js.map
