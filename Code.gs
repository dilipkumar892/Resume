/**
 * Google Apps Script - Contact Form to Google Sheets (hardened)
 *
 * HOW TO SETUP:
 * 1. Create a new Google Sheet
 * 2. (Optional) Rename the first tab to "Responses"
 * 3. Go to Extensions > Apps Script
 * 4. Paste this code and save
 * 5. Deploy > New Deployment > Web App
 * 6. Set "Execute as" = "Me" and "Who has access" = "Anyone"
 * 7. Copy the Web App URL
 * 8. Update index.html: replace YOUR_SCRIPT_ID in the form action URL
 */

var SHEET_NAME = 'Responses';          // Named sheet (B1)
var MAX_MSG_LENGTH = 2000;             // Safety cap for message length
var MAX_SUBMISSIONS_PER_HOUR = 60;     // Global script-wide rate limit (B4)

function doPost(e) {
  try {
    // ---- Rate limiting (script-wide, per hour) ----
    // Note: Apps Script web apps don't expose the client IP to the handler, so
    // we use a script-wide counter as a coarse abuse guard. The honeypot +
    // client-side time-gate are the primary spam protections.
    var cache = CacheService.getScriptCache();
    var cacheKey = 'submit_count';
    var currentCount = parseInt(cache.get(cacheKey) || '0', 10);
    if (currentCount >= MAX_SUBMISSIONS_PER_HOUR) {
      return jsonResponse({
        result: 'error',
        message: 'Too many submissions. Please try again later.'
      }, 429);
    }

    // ---- Honeypot (B4) ----
    var website = (e.parameter.website || '').trim();
    if (website !== '') {
      // Silently accept so bots think they succeeded
      return jsonResponse({ result: 'success', message: 'Data saved to Google Sheet' });
    }

    // ---- Read + trim input ----
    var name = (e.parameter.name || '').trim();
    var email = (e.parameter.email || '').trim();
    var message = (e.parameter.message || '').trim();

    // ---- Validation (B2) ----
    if (!name) return jsonResponse({ result: 'error', message: 'Name is required.' }, 400);
    if (!email || !isValidEmail(email)) return jsonResponse({ result: 'error', message: 'A valid email is required.' }, 400);
    if (!message) return jsonResponse({ result: 'error', message: 'Message is required.' }, 400);
    if (name.length > 200 || email.length > 254 || message.length > MAX_MSG_LENGTH) {
      return jsonResponse({ result: 'error', message: 'One or more fields are too long.' }, 400);
    }

    // ---- Sanitize against formula injection (B3) ----
    name = sanitizeFormula(name);
    email = sanitizeFormula(email);
    message = sanitizeFormula(message);

    // ---- Write to a NAMED sheet (B1) ----
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    // Ensure header row exists
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, 5).setValues([['Timestamp', 'Name', 'Email', 'Message', 'Status']]);
    }

    // Append the row
    var nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1, 1, 5).setValues([[new Date(), name, email, message, 'Received']]);

    // ---- Update rate-limit counter ----
    cache.put(cacheKey, String(currentCount + 1), 3600); // expires in 1 hour

    return jsonResponse({ result: 'success', message: 'Data saved to Google Sheet' });
  } catch (error) {
    return jsonResponse({ result: 'error', message: error.toString() }, 500);
  }
}

/**
 * GET handler - returns status
 */
function doGet() {
  return jsonResponse({ status: 'active', message: 'Google Sheets web app is running' });
}

/**
 * Helper: build a JSON ContentService response with an HTTP status code.
 * ContentService cannot set a real HTTP status code, so we embed it in the payload.
 */
function jsonResponse(payload, statusCode) {
  if (statusCode) {
    payload.httpStatus = statusCode;
  }
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Helper: basic email format check.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Helper: neutralize spreadsheet formula injection.
 * Values that start with =, +, -, @ (or tab/CR) get a leading apostrophe.
 */
function sanitizeFormula(value) {
  if (/^[=+\-@\t\r]/.test(value)) {
    return "'" + value;
  }
  return value;
}

/**
 * Test function to verify deployment works.
 * Run manually from the Apps Script editor.
 */
function testDoPost() {
  var testEvent = {
    parameter: {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message.'
    }
  };
  var result = doPost(testEvent);
  Logger.log(result.getContent());
}

