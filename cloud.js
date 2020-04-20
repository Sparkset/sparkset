const AV = require("leanengine");
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
AV.Cloud.afterSave("Client", request => {
  const events = [
    {
      name: "Welcome Email With Next Steps"
    },
    {
      name: "Welcome Package"
    },
    {
      name: "Kick-Off Meeting, Team Introduction, Goal-Setting"
    },
    {
      name: "Account Health Check"
    },
    {
      name: "Monthly Status Report and Budget Updates",
      recursIn: 30
    },
    {
      name: "Weekly Communication Touchpoints",
      recursIn: 7
    },
    {
      name: "Monthly In-Person Meeting",
      recursIn: 30
    },
    {
      name: "Bi-Monthly Non-Business Function",
      recursIn: 60
    },
    {
      name: "Birthday Gift and Personalized Note",
      recursIn: 365
    },
    {
      name: "Monthly Article, Book, Tip or Recommendation",
      recursIn: 30
    }
  ];
  AV.Object.saveAll(
    events.map(event =>
      new AV.Object("Event")
        .set("client", request.object)
        .set("name", event.name)
        .set("recursIn", event.recursIn)
        .set(
          "time",
          new Date(
            new Date(
              new Date().setDate(new Date().getDate() + event.recursIn || 3)
            ).setSeconds(0)
          )
        )
    )
  );
});
