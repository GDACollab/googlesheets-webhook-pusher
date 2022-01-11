# Google Sheets Webhook Pusher
This is a collection of scripts you can add to any google sheets document to then modify and use to push webhooks. The current version of the script
is designed to use [Discord webhooks](https://discord.com/developers/docs/resources/webhook). Here's how it works:

Step 1: Open a google sheets document.
Step 2: Go to Extensions->Apps Script
Step 3: Add Main.gs, sheetData.gs, webhookdata.gs, config.gs, and configPage.html to the apps script.
Step 4: Add named ranges according to Main.gs and webhookdata.gs, and modify the functions in Main.gs and webhookdata.gs according to their respective comments.
Step 5: That's it! All you need to do is make changes to the spreadsheet, go to PersonTally->Config Page (Or whatever else you rename it), add your webhook URLs and save changes, then go to Person Tally->Force Review (or whatever else you rename it in the script) and the changes will be pushed!
Step 6: In the apps script view, you should be able to schedule executions of the script if you want information pushed daily, weekly, or hourly.

This should be fairly self-explanatory (as long as you're familiar with code and the layout of spreadsheets). I would make improvements, but I have deadlines to meet.