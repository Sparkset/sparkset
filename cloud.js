const AV = require("leanengine");
// const { getEmail } = require("./src/services/auth");
// const { createNewEvent } = require("./src/services/graph"); //incompatible imports ES modules vs. commonjs

AV.Cloud.beforeSave("Note", request => {
  request.object.set("owner", request.currentUser);
});
AV.Cloud.beforeSave("_User", request => {
  if (request.currentUser) {
    if (!request.currentUser.get("allowAddingNewUsers")) {
      throw new AV.Cloud.Error("You are not allowed to add new users.");
    }
  } else {
    throw new AV.Cloud.Error("You are not logged in.");
  }
});
AV.Cloud.afterSave("Client", request => {      // should be async for event syncing "async request"
  const events = [
    {
      name: "Welcome Email With Next Steps",
      delay: 1,
      syncId: null
    },
    {
      name: "Welcome Package",
      delay: 2,
      syncId: null
    },
    {
      name: "Kick-Off Meeting, Team Introduction, Goal-Setting",
      delay: 3,
      syncId: null
    },
    {
      name: "Account Health Check",
      delay: 90,
      syncId: null
    },
    {
      name: "Monthly Status Report and Budget Updates",
      recursIn: 30,
      syncId: null
    },
    {
      name: "Weekly Communication Touchpoints",
      recursIn: 7,
      syncId: null
    },
    {
      name: "Monthly In-Person Meeting",
      recursIn: 30,
      delay: 5,
      syncId: null
    },
    {
      name: "Bi-Monthly Non-Business Function",
      recursIn: 60,
      syncId: null
    },
    {
      name: "Birthday Gift and Personalized Note",
      recursIn: 365,
      syncId: null
    },
    {
      name: "Monthly Article, Book, Tip or Recommendation",
      recursIn: 30,
      delay: 15,
      syncId: null 
    }
  ];
  // const signedIn = getEmail();      // if signed in, sync the events too 
  // if (signedIn) {   
  //   // give date object for time and endTime
  //   const days = {0: "Sunday", 1: "Monday", 2: "Tuesday", 3: "Wednesday", 4: "Thursday", 5: "Friday", 6: "Saturday"};
  //   const type = {7: "weekly", 30: "absoluteMonthly", 60: "absoluteMonthly", 365: "absoluteYearly"}
  //   const clientName = request.object.get("fullName");   
  //   events.forEach(async event => {    // remember delay is part of start date/end/recurr!!!!, also special case 60
  //     let result = null;
  //     const eventName = clientName + " - " + event.name;
  //     let startDate = new Date(
  //                       new Date(
  //                         new Date().setDate(new Date().getDate() + (event.delay || 0)) 
  //                       ).setSeconds(0)
  //                     );
  //     let endDate = new Date( 
  //                     new Date( 
  //                       new Date( 
  //                         new Date().setDate(new Date().getDate() + (event.delay || 0)) 
  //                       ).setSeconds(0) 
  //                     ).setHours(new Date().getHours()+1)
  //                   );
  //     if (event.recursIn) {  
  //       const dayInput = (event.recursIn == 7) ? days[startDate.getDay()] : startDate.getDate();
  //       let endRepeat = new Date(
  //                         new Date( 
  //                           new Date( 
  //                             new Date( 
  //                               new Date().setDate(new Date().getDate() + (event.delay || 0))
  //                             ).setSeconds(0) 
  //                           ).setHours(new Date().getHours()+1)
  //                         ).setFullYear(new Date().getFullYear()+2)
  //                       );
  //       let recurr = [type[event.recursIn], dayInput, endRepeat, 1]; //let's think about endREpeatDAte: set 2 year automatically
  //       if (event.recursIn == 60) {
  //         recurr[3] = 2; 
  //       }
  //       result = await createNewEvent(eventName, startDate, endDate, "", recurr);
  //     }
  //     else {
  //       result = await createNewEvent(eventName, startDate, endDate, "");
  //     }
  //     if (result) {
  //       event.syncId = result.id; // const events needs to be "let events"
  //     }
  //   });
  // }
  AV.Object.saveAll(
    events.map(event =>
      new AV.Object("Event")
        .set("client", request.object)
        .set("name", event.name)
        .set("recursIn", event.recursIn)
        .set("syncId", event.syncId)
        .set(
          "time",
          new Date(
            new Date(
              new Date().setDate(
                new Date().getDate() +
                  (event.recursIn || 0) +
                  (event.delay || 0)
              )
            ).setSeconds(0)
          )
        )
        .set(
          "endTime",
          new Date(
            new Date(
              new Date(
                new Date().setDate(
                  new Date().getDate() +
                    (event.recursIn || 0) +
                    (event.delay || 0)
                )
              ).setSeconds(0)
            ).setHours(new Date().getHours()+1)
          )
        )
    )
  ); 
});
