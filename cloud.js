const AV = require("leanengine");
AV.Cloud.beforeSave("Note", request => {
  request.object.set("owner", request.currentUser);
});
