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
      console.log("process_env" +process.env.VUE_APP_MSAL_CLIENT_ID);
      const authResult = await msalClient.loginPopup(m.msalRequest);
      // take this out after testing
      console.log('id_token acquired at: ' + new Date().toString()); 
      // Save the account username, needed for token acquisition
      window.localStorage.setItem('msalAccount', authResult.account.username);  
  
      // Get the user's profile from Graph
      let user = await getUser();
      // Save the profile in session
      window.localStorage.setItem('graphUser', JSON.stringify(user));

      console.log(user.userPrincipalName);                      //new
      return user.userPrincipalName;                            //new
    } 
    catch (error) {
        console.log(error);
        return false;                                             //new
    }
    
};

export function getEmail() {
  console.log(account);
  if (account) {
    return account;
  }
  else {
    console.log("No account signed in.");
    return false;
  }
};

export async function getToken() //only used in graph.js
{
    console.log("in getToken");
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

export function signOut() //use this to sign out
{
  account = null;
  window.localStorage.removeItem('graphUser');
  msalClient.logout();
};