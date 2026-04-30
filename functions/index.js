const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { BigQuery } = require("@google-cloud/bigquery");

admin.initializeApp();

const bigquery = new BigQuery();
const datasetId = "election_analytics";
const tableId = "user_feedback";

/**
 * Triggered by a new document in the 'feedback' collection.
 * Sanitizes the feedback further and streams it to BigQuery.
 */
exports.processFeedback = functions.firestore
    .document("feedback/{docId}")
    .onCreate(async (snap, context) => {
        const newValue = snap.data();
        const feedbackText = newValue.text;
        const timestamp = newValue.createdAt ? newValue.createdAt.toDate().toISOString() : new Date().toISOString();

        console.log(`Processing feedback: ${context.params.docId}`);

        // Define BigQuery rows
        const rows = [{
            feedback_id: context.params.docId,
            text: feedbackText,
            timestamp: timestamp,
            processed_at: new Date().toISOString(),
        }];

        try {
            // Insert data into BigQuery
            await bigquery
                .dataset(datasetId)
                .table(tableId)
                .insert(rows);
            console.log(`Successfully streamed feedback to BigQuery.`);
        } catch (error) {
            console.error("BigQuery insert error:", error);
            // We don't throw here to avoid infinite retries unless desired
        }
    });

/**
 * (AI WORKFLOW) Dynamic Response Function
 * This is an HTTPS callable function that could eventually use Gemini.
 */
exports.getDynamicResponse = functions.https.onCall(async (data, context) => {
    // Check authentication
    if (!context.auth) {
        throw new functions.https.HttpsError(
            "unauthenticated",
            "The function must be called while authenticated."
        );
    }

    const userMessage = data.message;
    console.log("AI received message:", userMessage);

    // MOCK: In a real implementation, call Gemini API here
    // const response = await gemini.generateContent(userMessage);
    
    return {
        reply: `Dynamic AI Response for: "${userMessage}"`,
        suggestedState: "greeting"
    };
});
