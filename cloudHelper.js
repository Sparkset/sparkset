const Msal = require ("@azure/msal-browser");
const m = require("./config");
const fetch = require ("isomorphic-fetch"); // or import the fetch polyfill you installed
const MicrosoftGraph = require ("@microsoft/microsoft-graph-client");
const msalClient = new Msal.PublicClientApplication(m.msalConfig);
let account = null;
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
const authProvider = {
    getAccessToken: async () => {
      return await getToken();
    }
};
const graphClient = fetch(MicrosoftGraph.Client.initWithMiddleware({authProvider}));

function getEmail() {
    const currentAccounts = msalClient.getAllAccounts();
    if (currentAccounts.length == 0) {
      return false;
    }
    else {
      return currentAccounts[0].username;
    }
  };

async function createNewEvent(name, startTime, endTime, notes, recurring = null) //creates new event. click to test
{
    //compare add event and graph.js side by side before pushing

    const user = JSON.parse(window.localStorage.getItem('graphUser')); 
    const start = (new Date(startTime.toString().split('GMT')[0]+' UTC').toISOString()).split(".")[0];
    const end = (new Date(endTime.toString().split('GMT')[0]+' UTC').toISOString()).split(".")[0];
    const subject = name;
    const body = notes;

    // Build the JSON payload of the event
    let newEvent = {
      subject: subject,
      start: {
        dateTime: start,
        timeZone: user.mailboxSettings.timeZone
      } ,
      end: {
        dateTime: end,
        timeZone: user.mailboxSettings.timeZone
      }
    };

    if (body) {
      newEvent.body = {
        contentType: 'text',
        content: body
      };
    }

    if (recurring !== null) {
      const recur = (new Date(recurring[2].toString().split('GMT')[0]+' UTC').toISOString()).split("T")[0];
      const date = (new Date(startTime.toString().split('GMT')[0]+' UTC').toISOString()).split("T")[0];
      newEvent.recurrence = { 
        pattern: {
          type: recurring[0],
          interval: recurring[3]
        },
        range: {
          type: "endDate", 
          startDate: date, 
          endDate: recur
        }
      };
      if (recurring[0] == "weekly") {
        newEvent.recurrence.pattern.daysOfWeek = [recurring[1]];
      }
      else if (recurring[0] == "absoluteMonthly") {
        newEvent.recurrence.pattern.dayOfMonth = recurring[1];
      }
      else if (recurring[0] == "absoluteYearly") {
        newEvent.recurrence.pattern.dayOfMonth = recurring[1];
        newEvent.recurrence.pattern.month = startTime.getMonth() + 1;
      }
    }
    try {
      // POST the JSON to the /me/events endpoint
      return await graphClient
        .api('/me/events')
        .post(newEvent);
  
    } 
    catch (error) {
      return false; //don't think this is needed
    }
};

module.exports = {getEmail, createNewEvent};