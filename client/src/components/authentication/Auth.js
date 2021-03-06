import history from '../../history';
import auth0 from 'auth0-js';

// ...
export default class Auth {
  accessToken;
  idToken;
  expiresAt;
  auth0 = new auth0.WebAuth({
    domain: 'team-refreshr.auth0.com',
    clientID: 'jNDq5B6iAnIRcrpM07Omh05uyppZ89px',
    audience: 'https://team-refreshr.auth0.com/api/v2/',
    //PRODUCTION
    //redirectUri: 'https://refreshr-app.netlify.com/loading',
    //DEVELOPMENT
    redirectUri: 'http://localhost:3000/loading',

    responseType: 'token id_token',
    scope: 'openid',
  });

  login = () => {
    this.auth0.authorize();
    
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        localStorage.setItem('token', authResult)
      
        // history.replace('/home')
      } else if (err) {
        history.replace('/home');
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  getAccessToken = () => {
    return this.accessToken;
  }

  getIdToken = () => {
    return this.idToken;
  }

  setSession = (authResult) => {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    let expiresAt = (authResult.expiresIn * 1000) + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    // navigate to the home route
    history.replace('/dashboard');
  }

  renewSession = () => {
    this.auth0.checkSession({}, (err, authResult) => {
       if (authResult && authResult.accessToken && authResult.idToken) {
         this.setSession(authResult);
       } else if (err) {
         this.logout();
         console.log(err);
         alert(`Could not get a new token (${err.error}: ${err.error_description}).`);
       }
    });
  }

  logout = () => {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');

    // navigate to the home route
    history.replace('/home');
  }

  isAuthenticated =() => {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = this.expiresAt;
    return new Date().getTime() < expiresAt;
  }


}