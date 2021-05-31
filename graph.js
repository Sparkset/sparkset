require ("isomorphic-fetch"); // or import the fetch polyfill you installed
const MicrosoftGraph = require ("@microsoft/microsoft-graph-client");
const auth = require ("./auth");
// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
      // Call getToken in auth.js
      // fetch(auth.getToken()).then(function(response) {
      //   return response;
      // });
      return await auth.getToken();
    }
};
  
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});

 async function getUser() // only used in auth.js
{
    fetch(graphClient
      .api('/me')
      // Only get the fields used by the app
      .select('id,displayName,mail,userPrincipalName,mailboxSettings')
      .get()).then(function(response) {
        return response;
      });

};

 async function updateEvent(id, name, date, startTime, endTime, notes)
{
    const user = JSON.parse(window.localStorage.getItem('graphUser')); 
    const start = date + "T" + startTime;  
    const end = date + "T" + endTime;
    const url = '/me/events/' + id;
    const event = {
      subject: name,
      start: {
        dateTime: start,
        timeZone: user.mailboxSettings.timeZone
      },
      end: {
        dateTime: end,
        timeZone: user.mailboxSettings.timeZone
      },
      body: {
        contentType: 'text',
        content: notes
      }
    };
    try {
      fetch(graphClient
        .api(url)
        .update(event)).then(function(response) {
          return response;
        });
    }
    catch (error) {
      return false;
    }
}

 async function deleteEvent(id) 
{
    const url = '/me/events/' + id;
    try {
      fetch(graphClient
        .api(url)
        .delete()).then(function(response) {
          return response;
        });
    } 
    catch (error) {
      return false;
    }
}

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
      fetch(graphClient
        .api('/me/events')
        .post(newEvent)).then(function(response) {
          return response;
        });
  
    } 
    catch (error) {
      return false; //don't think this is needed
    }
};

module.exports = {getUser, updateEvent, deleteEvent, createNewEvent};