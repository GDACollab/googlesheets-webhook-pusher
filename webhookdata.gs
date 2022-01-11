// What to do when modifying this function:
// You don't really need to worry about url, that's just the url to push to the webhook.
// webhookData is an array of objects, with each object representing a row in a range. Each object has two properties:
// id - This is the identifier for an object. If the named range has the word "KEY" somewhere in there, then this will be the value of the first
// column in that row. Otherwise, this will just be the order that the row appears in (so 0 if it's the first row in the range, 1 if it's the second row in the range, etc.)
// data - The actual data for each row. Again, if the named range has the word "KEY" in there, then these will be actual keys. Otherwise, these'll just be sorted by column order.
function pushWebhooks(url, webhookData){
  // Let's just assume for this simple tally script there's only ONE named range we're keeping track of:
  var text = "Person Tally: " + webhookData[0].data[0];
  var payload = {
    "content": text
  };
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, options);
}