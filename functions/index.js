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

exports.getQr = functions.https.onCall((data, context) => {
  const id = data.id;
  const local = data.local;

  const firestore = admin.firestore();

  return firestore.collection('UserQRCodes').doc(id).get().then(x=> {
    if (!local) {
      const userId = x.data().userId;
      const currentTimeStamp = new Date().getTime();
      const oneHourLater = new Date().getTime() + (1*60*60*1000);

      firestore.collection("Users").doc(userId).onSnapshot(u => {
        const userFcmToken = u.data().fcmToken;

        firestore.collection("NotificationQueue").where("userId", "==", userId).where("expiredAt",">",currentTimeStamp).onSnapshot(prevSnapShot=> {
          if(prevSnapShot.docs.length === 0)
          {
            firestore.collection("NotificationQueue").add({
              text:"'" + x.data().qrName + "' QR has been scanned by someone!",
              fcmToken : userFcmToken,
              userId: userId,
              timestamp: currentTimeStamp,
              expiredAt: oneHourLater
            });
    
            firestore.collection("UserNotifications").add({
              text:"'" + x.data().qrName + "' QR has been scanned by someone!",
              isRead: false,
              navigation: null,
              userId: userId,
              timestamp: currentTimeStamp
            });
          }
        });
      });
    }
    return x.data();
  });
});