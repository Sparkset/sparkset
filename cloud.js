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
