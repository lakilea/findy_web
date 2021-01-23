const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendNewNotification = functions.firestore.document("NotificationQueue/{docId}").onCreate((queryDocumentSnapshot, eventContext)=>{
  const newlyCreatedDocumentID = eventContext.params.docId;
  const createdData = queryDocumentSnapshot.data();
  
  admin.messaging().send({
    token: createdData.fcmToken,
    notification : {
      title:"findy",
      body: createdData.text
    }
  }).then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

  return 0;
});