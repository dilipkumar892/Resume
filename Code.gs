/**
 * Google Apps Script - Contact Form to Google Sheets
 * 
 * HOW TO SETUP:
 * 1. Create a new Google Sheet
 * 2. Name column headers in Row 1: Timestamp | Name | Email | Message
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code and save
 * 5. Deploy > New Deployment > Web App
 * 6. Set "Execute as" = "Me" and "Who has access" = "Anyone"
 * 7. Copy the Web App URL
 * 8. Update index.html: replace YOUR_SCRIPT_ID in the form action URL
 */

function doPost(e) {
  try {
    // Get the connected spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getActiveSheet();
    
    // Get form data
    const name = e.parameter.name || '';
    const email = e.parameter.email || '';
    const message = e.parameter.message || '';
    const timestamp = new Date();
    
    // Check if header row exists, if not create it
    const lastRow = sheet.getLastRow();
    if (lastRow === 0) {
      sheet.getRange(1, 1, 1, 4).setValues([['Timestamp', 'Name', 'Email', 'Message']]);
    }
    
    // Append data to the sheet
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, 4).setValues([[timestamp, name, email, message]]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success', message: 'Data saved to Google Sheet' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify deployment works
 * You can run this manually from the Apps Script editor
 */
function testDoPost() {
  const testEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message.'
    }
  };
  
  const result = doPost(testEvent);
  Logger.log(result.getContent());
}

/**
 * GET handler - returns status
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'active', message: 'Google Sheets web app is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

