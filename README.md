## Jwt Auth


#### Usage example

* **Provider**

* Wrap your application with the provider

```javascript
ReactDOM.render(
      <JwtAuthProvider keyPrefix="YOUR APP KEY">
          <App />
      </JwtAuthProvider>,
  document.getElementById('root'),
);
```

* **Hooks**

```javascript
import useJwtAuth from '@gabrielgvl/jwt_auth_react';

const MyComponent = () => {
  const { handleLogin, logIn, logOut, userInfo } = useJwtAuth();
}
```

* ```logIn(token)``` - Passes response jwt token to storage
* ```logOut()``` - Remove token from storage
* ```isLoggedIn``` - Check if token is in storage
* ```userInfo``` - Retrieves decoded user info from token

