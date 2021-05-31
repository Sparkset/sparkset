const Msal = require ("@azure/msal-browser");
import {getUser} from "./graph";
const m = require("../../config.js");

const msalClient = new Msal.PublicClientApplication(m.msalConfig);

let account = null;
 
export async function signIn() 
{
    // Login
    try {
      // Use MSAL to login
      const authResult = await msalClient.loginPopup(m.msalRequest);
      // Save the account username, needed for token acquisition
      window.localStorage.setItem('msalAccount', authResult.account.username);  
      // Get the user's profile from Graph
      let user = await getUser();
      // Save the profile in session
      window.localStorage.setItem('graphUser', JSON.stringify(user));
      return user.userPrincipalName;                     
    } 
    catch (error) {
        return false;                                       
    }
    
};

export function getEmail() {
  const currentAccounts = msalClient.getAllAccounts();
  if (currentAccounts.length == 0) {
    // console.log("or");
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
    let user = await getUser();
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
            let user = await getUser();
            window.localStorage.setItem('graphUser', JSON.stringify(user));
          }
          catch(e) {
            return false;
          }
      } else if (currentAccounts.length === 1) {
          account = currentAccounts[0].username;
      }
  }
  return account;
};

export async function autoSignIn() {
  msalClient.handleRedirectPromise().then(handleResponse);
}

export async function getToken() {
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

    } catch (silentError) {
      // If silent requests fails with InteractionRequiredAuthError,
      // attempt to get the token interactively
      if (silentError instanceof Msal.InteractionRequiredAuthError) {
        const interactiveResult = await msalClient.acquireTokenPopup(m.msalRequest);
        return interactiveResult.accessToken;

      } else {
        throw silentError;
      }
    }
};

export async function signOut() {
  account = window.localStorage.getItem('msalAccount');
  const logoutRequest = {
    account: msalClient.getAccountByUsername(account),
    mainWindowRedirectUri: "https://admin.hellosparkset.com/settings"       //rememeber to change this in live/dev
  }
  account = null;
  window.localStorage.removeItem('graphUser');
  await msalClient.logoutPopup(logoutRequest); 
};