// require ("isomorphic-fetch"); // or import the fetch polyfill you installed
const Msal = require ("@azure/msal-browser");
const graph = require ("./graph");
const m = require("./config.js");

const msalClient = new Msal.PublicClientApplication(m.msalConfig);

let account = null;
 
 async function signIn() 
{
    // Login
    try {
      // Use MSAL to login
      const authResult = await msalClient.loginPopup(m.msalRequest);
      // Save the account username, needed for token acquisition
      window.localStorage.setItem('msalAccount', authResult.account.username); 
      // Get the user's profile from Graph
      let user = await graph.getUser();
      // Save the profile in session
      window.localStorage.setItem('graphUser', JSON.stringify(user));

      return user.userPrincipalName;                      
    } 
    catch (error) {
        return false;                                       
    }
    
};

 function getEmail() {
  const currentAccounts = msalClient.getAllAccounts();
  if (currentAccounts.length == 0) {
    return false;
  }
  else {
    return currentAccounts[0].username;
  }
};

 async function handleResponse(response) {
  if (response !== null) {
    account = response.account.username;
    window.localStorage.setItem('msalAccount', response.account.username);  
    let user = await graph.getUser();
    window.localStorage.setItem('graphUser', JSON.stringify(user));
    // Display signed-in user content, call API, etc.
  } else {
      // In case multiple accounts exist, you can select
      const currentAccounts = msalClient.getAllAccounts();

      if (currentAccounts.length === 0) {
          // no accounts signed-in, attempt to sign a user in
          try {
            const authResult = await msalClient.loginRedirect(m.msalRequest);
            window.localStorage.setItem('msalAccount', authResult.account.username);  
            let user = await graph.getUser();
            window.localStorage.setItem('graphUser', JSON.stringify(user));
          }
          catch(e) {
            return e;
          }
      } else if (currentAccounts.length === 1) {
          account = currentAccounts[0].username;
      }
  }
  return account;
};

 async function autoSignIn() {
  msalClient.handleRedirectPromise().then(handleResponse);
}

 async function getToken() {//only used in graph.js
    account = window.localStorage.getItem('msalAccount'); //changed from let account
    if (!account) {
      throw new Error(
        'User account missing from session. Please sign out and sign in again.');
    }
    try {
      // First, attempt to get the token silently
      const silentRequest = {
        scopes: m.msalRequest.scopes,
        account: msalClient.getAccountByUsername(account) 
      };
  
      const silentResult = await msalClient.acquireTokenSilent(silentRequest);
      return silentResult.accessToken;
      // fetch(msalClient.acquireTokenSilent(silentRequest)).then(function(silentResult) {
      //   return silentResult.accessToken;
      // });
    } catch (silentError) {
      // If silent requests fails with InteractionRequiredAuthError,
      // attempt to get the token interactively
      if (silentError instanceof Msal.InteractionRequiredAuthError) {
        const interactiveResult = await msalClient.acquireTokenPopup(m.msalRequest);
        return interactiveResult.accessToken;
        // fetch(msalClient.acquireTokenPopup(m.msalRequest)).then(function(interactiveResult) {
        //   return interactiveResult.accessToken;
        // })
      } else {
        throw silentError;
      }
    }
};

 async function signOut() {//use this to sign out
  account = window.localStorage.getItem('msalAccount');
  const logoutRequest = {
    account: msalClient.getAccountByUsername(account),
    mainWindowRedirectUri: "http://localhost:8080/settings"       //rememebr to change this in live 
  }
  account = null;
  window.localStorage.removeItem('graphUser');
  await msalClient.logoutPopup(logoutRequest); 
};

module.exports.getToken = getToken;
module.exports.signIn = signIn;
module.exports.getEmail = getEmail;
module.exports.autoSignIn = autoSignIn;
module.exports.signOut = signOut;