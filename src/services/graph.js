import * as MicrosoftGraph from "@microsoft/microsoft-graph-client";
//import * as momentT from "moment-timezone";
import { getToken } from "./auth.js";

// Create an authentication provider
const authProvider = {
    getAccessToken: async () => {
      // Call getToken in auth.js
      return await getToken();
    }
};
  
// Initialize the Graph client
const graphClient = MicrosoftGraph.Client.initWithMiddleware({authProvider});

export async function getUser() // only used in auth.js
{
    return await graphClient
      .api('/me')
      // Only get the fields used by the app
      .select('id,displayName,mail,userPrincipalName,mailboxSettings')
      .get();
};

export async function updateEvent(id, name, date, startTime, endTime, notes)
{
    console.log(endTime);
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
      return await graphClient
        .api(url)
        .update(event);
    }
    catch (error) {
      console.log("something went wrong");  //something else here porb
    }
}

export async function deleteEvent(id) 
{
    const url = '/me/events/' + id;
    try {
      return await graphClient
        .api(url)
        .delete();
    } 
    catch (error) {
      console.log("something went wrong");  //something else here porb
    }
}

export async function createNewEvent(name, date, startTime, endTime, notes, recurring = null) //creates new event. click to test
{
    const user = JSON.parse(window.localStorage.getItem('graphUser')); 
    // name = string 
    // date = "2021-05-06"
    // time = "10:00" (24 hour clock) 
    // notes = string
    // { pattern: { type: "weekly", interval: 1, daysOfWeek: [ "Monday" ] }, range: {type: "endDate",startDate: "2017-09-04",endDate: "2017-12-31"};
    const subject = name;
    const start = date + "T" + startTime;
    const end = date + "T" + endTime;
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
    if (recurring) {
      newEvent.recurrence = { 
        pattern: {
          type: recurring[0],
          interval: 1, 
          daysOfWeek: [recurring[1]]
        },
        range: {
          type: "endDate", 
          startDate: date,
          endDate: recurring[2]
        }
      };
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