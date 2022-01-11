function drawConfig(){
  var user = Session.getActiveUser();
  var owner = SpreadsheetApp.getActive().getOwner();
  if (user.getEmail() === owner.getEmail()){
    var page = HtmlService.createHtmlOutputFromFile("configPage").setTitle("Webhook Configuration");
    SpreadsheetApp.getUi().showSidebar(page);
  } else {
    SpreadsheetApp.getUi().alert("I'm sorry, you have to be the owner of this document to configure Webhooks.");
  }
}

function getConfigProperties(){
  var obj = {};
  var props = PropertiesService.getDocumentProperties();
  props.getKeys().forEach(function(key){
    obj[key] = props.getProperty(key);
  });
  return obj;
}

function setConfigProperties(obj){
  var props = PropertiesService.getDocumentProperties();
  for (var key in obj){
    var value = obj[key];
    props.setProperty(key, value);
  }
}

function resetNotifications(){
  var props = PropertiesService.getDocumentProperties();
  props.getKeys().forEach(function(key){
    var assetMatch = /WebhookTracker_/;
    if (key.match(assetMatch)){
      props.setProperty(key, "{}");
    }
  });
  onSheetChange();
}