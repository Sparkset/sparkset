import * as Msal from "@azure/msal-browser";
import {getUser} from "./graph.js";  
const m = require("../../config.js");

const msalClient = new Msal.PublicClientApplication(m.msalConfig);

let account = null;
 
export async function signIn() //use this to sign in
{
    // Login
    try {
      // Use MSAL to login
      //console.log("process_env" +process.env.VUE_APP_MSAL_CLIENT_ID);
      const authResult = await msalClient.loginPopup(m.msalRequest);
      // take this out after testing
      //console.log('id_token acquired at: ' + new Date().toString()); 
      // Save the account username, needed for token acquisition
      window.localStorage.setItem('msalAccount', authResult.account.username);  //save the profile in leancloud acc
      // mine window.localStorage.setItem('msEmailAccount', JSON.stringify(authResult.account));
      // Get the user's profile from Graph
      window.localStorage.setItem('authResult', JSON.stringify(authResult));
      let user = await getUser();
      // Save the profile in session
      window.localStorage.setItem('graphUser', JSON.stringify(user));

      //console.log(user.userPrincipalName);                      //save the profile in leancloud acc
      return user.userPrincipalName;                            //new
    } 
    catch (error) {
        //console.log(error);
        return false;                                             //new
    }
    
};

export function getEmail() {
  console.log("in getEmail");
  const currentAccounts = msalClient.getAllAccounts();
  if (currentAccounts.length == 0) {
    return false;
  }
  else {
    console.log(currentAccounts[0].username);
    return currentAccounts[0].username;
  }
};

export async function handleResponse(response) {
  if (response !== null) {
    account = response.account.username;
    window.localStorage.setItem('msalAccount', response.account.username);  
    window.localStorage.setItem('authResult', JSON.stringify(response));
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
            window.localStorage.setItem('authResult', JSON.stringify(authResult));
            let user = await getUser();
            window.localStorage.setItem('graphUser', JSON.stringify(user));
          }
          catch(e) {
            console.log(e);
          }
      } else if (currentAccounts.length === 1) {
          account = currentAccounts[0].username;
      }
      else {
        console.log(currentAccounts);
      }
  }
  return account;
};

export async function autoSignIn() {
  msalClient.handleRedirectPromise().then(handleResponse);
}

export async function getToken() {//only used in graph.js
    //console.log("in getToken");
    account = window.localStorage.getItem('msalAccount'); //changed from let account
    //console.log(account);
    if (!account) {
      throw new Error(
        'User account missing from session. Please sign out and sign in again.');
    }
    try {
      //console.log(window.localStorage.getItem('msEmailAccount'));
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

export async function signOut() {//use this to sign out
  window.localStorage.removeItem('graphUser');
  account = window.localStorage.getItem('msalAccount');
  const logoutRequest = {
    account: msalClient.getAccountByUsername(account),
    mainWindowRedirectUri: "http://localhost:8080/settings"       //rememebr to change this in live 
  }
  account = null;
  await msalClient.logoutPopup(logoutRequest); 
  
  //msalClient.logout(); //fix this 
};