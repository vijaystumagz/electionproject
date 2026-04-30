/**
 * ELEXIA ANALYTICS PROXY (Google Apps Script)
 * 
 * Instructions:
 * 1. Go to https://script.google.com
 * 2. Create a new project.
 * 3. Paste this code.
 * 4. In the left menu, click 'Services' (+) and add 'BigQuery API'.
 * 5. Click 'Deploy' > 'New Deployment'.
 * 6. Select 'Web App'.
 * 7. Set 'Who has access' to 'Anyone'.
 * 8. Copy the Web App URL and add it to your .env as VITE_ANALYTICS_PROXY_URL.
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const feedbackText = data.text;
    const timestamp = new Date().toISOString();

    // Stream to BigQuery
    const projectId = 'electionprocess-1b37d'; // Update if needed
    const datasetId = 'election_analytics';
    const tableId = 'user_feedback';

    const row = {
      feedback_id: Utilities.getUuid(),
      text: feedbackText,
      timestamp: timestamp,
      processed_at: new Date().toISOString()
    };

    const insertRequest = {
      rows: [{ json: row }]
    };

    BigQuery.Tabledata.insertAll(insertRequest, projectId, datasetId, tableId);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
