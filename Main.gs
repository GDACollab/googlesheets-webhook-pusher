// STEPS TO TAKE WHEN MODIFYING THIS SCRIPT.
// STEP ONE: MODIFY THE FUNCTION BELOW TO CHANGE THE NAME OF THE MENU.
// STEP TWO: MODIFY WEBHOOKDATA.GS TO YOUR LIKING. THE COMMENTS THERE SHOULD BE USEFUL.
// STEP THREE: MAKE SOME NAMED RANGES. Name some of these ranges with "KEY" if they have include a header column you want to keep track of (Webhookdata.gs will tell you more about keys and headers).
// STEP FOUR: MODIFY ONSHEETCHANGE TO FILTER THROUGH THE NAMED RANGES IF YOU NEED TO.
// That's it!
function onOpen(e){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Person Tally")
  .addItem("Force Review", "onSheetChange")
  .addItem("Open Webhook Config", "drawConfig")
  .addToUi();
}

// (OLD) TODO:
// Config should be able to set the range (instead of using Named Ranges)? (Might be a problem with multiple asset sheets per spreadsheet?)
// Customization for whether or not the asset manager to check to see if something is implemented
// Options for specifying what headers do what 
// Which column represents Implemented? And whether or not assets that are Implemented should be notified.
// Which column represents the link for text (used for generating shortcuts and creating links in the webhook).
// Test with two webhooks
// Make it look good.
function onSheetChange(){
  var rangesToRead = SpreadsheetApp.getActive().getNamedRanges();
  rangesToRead.forEach(function(range){
    var readData = new SheetData(range);
    // You can filter through gathered data if you wish from readData.diffs (which is what will be passed to webhookData)
    readData.pushToWebhooks();
  });
}