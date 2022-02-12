class SheetData {
  // range should be a NamedRange
  constructor(range){
    var props = PropertiesService.getDocumentProperties();
    var webhook = props.getProperty("webhook").split(",");
    if (webhook.length > 0){
      // If any of the named ranges passed through have KEY somewhere in the title, then we can assume they use headers to store data (like a first column for info). 
      var regexRangeName = /KEY/g;
      this.rangeData = this.readData(range.getRange(), range.getName().match(regexRangeName));
      this.diffs = this.getDifferences(this.rangeData, range.getName());
    } else {
      var ui = SpreadsheetApp.getUi();
      ui.alert("Please set the webhook URL using the Asset Manager menu.");
    }
  }

  // Take the data from a range, separate it into rows, and store each row in an object.
  // range indicates the range, hasKeys indicates whether or not the range has keys (i.e., a header, and if the range has keys, the object will store that data by the first column header).
  // Returns: {obj: rangeData, keys: keysArr}.
  // if hasKeys is false, the objects are stored by their column number, and keysArr will just return column indices instead of actual key strings.
  readData(range, hasKeys){
    var values = range.getValues();

    // rangeObj stores each row by either the relevant key (if hasKeys is true), or by the row number.
    var rangeObj = {};
    // We create a separate keys objects in case someone (for some reason) uses "keys" as a header name.
    // This would be incredibly stupid, but it's best to expect the worst.
    var keys = [];

    // If we don't have keys, we can still use the keys array to store indices: 
    if(!hasKeys){
      values[0].forEach(function(row, rowIndex){
        keys[rowIndex] = rowIndex;
      });
    }

    values.forEach(function(col, colIndex){
      if (colIndex === 0 && hasKeys) { // If our column is 0, that means we're at the row with all the headers, so we use that to set up our keys.
        col.forEach(function(row, index){
          keys[index] = row;
        });
      } else { // Otherwise, construct our object from what we know about our keys.
        var obj = {};
        col.forEach(function(row, index){
          obj[keys[index]] = row;
        });


        // If the range uses keys, we store those:
        if (hasKeys){
          rangeObj[obj[keys[0]]] = obj;
        } else {
          // Otherwise, store each row by the row number:
          rangeObj[colIndex] = obj;
        }

      }
    });
    return {obj: rangeObj, keys: keys, usesKeys: hasKeys};
  }

  // Read the data returned by readData, and store that to the current document properties. If there are differences with the current props, push the new differing object
  // to an array, and return that.
  getDifferences(diffObj, rangeName){
    var props = PropertiesService.getDocumentProperties();
    var diffs = [];

    // We also need to set the differences once we're done counting them:
    var newDiffProp = {};
    // We get the currently stored data for this range, and we can use that to sift for differences:
    var diffProp = JSON.parse(props.getProperty("WebhookTracker_" + rangeName));
    for (var objId in diffObj.obj) { // Look at all the objects currently written in the spreadsheet.
      var object = diffObj.obj[objId];
      var newObj = {id: objId, data: object};
      newDiffProp[objId] = newObj;

      if (diffProp == null || !(objId in diffProp)){ // If we don't have track of one row in our current "database", we push it to the list of things to notify.
        diffs.push(newObj);
      } else {
        for (var key in object){
          var value = object[key];
          if(value != diffProp[objId]["data"][key]){ // We have a difference in our stored rows, push that to the list of things to notify.
            diffs.push(newObj);
          }
        }
      }
    }

    // And now we set the new data we just collected:
    props.setProperty("WebhookTracker_" + rangeName, JSON.stringify(newDiffProp));

    return diffs;
  }

  pushToWebhooks(){
    var self = this;
    if (self.diffs.length > 0) {
      var props = PropertiesService.getDocumentProperties();
      // We need to iterate through all the webhooks that are currently set up:
      var webhooks = props.getProperty("webhook").split(",");
      if (webhooks.length > 0){
        webhooks.forEach(function(w){
          // Now we call the script from webhookdata.gs:
          pushWebhooks(w, self.diffs);
        });
      } else {
        var ui = SpreadsheetApp.getUi();
        ui.alert("No webhook URLs detected. Please set the webhook URL using the Webhook configuration menu.");
      }
    }
  }
}
