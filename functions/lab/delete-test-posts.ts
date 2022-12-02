import "../tests/firebase.init";
import * as admin from "firebase-admin";

// Get user documents under the collection 'users' in the Firestore database and log them to the console.
admin
  .firestore()
  .collection("posts")
  .get()
  .then((snapshot) => {
    snapshot.forEach(async (doc) => {
      const data = doc.data();
      if (data.content === "oo") {
        console.log(`${doc.id} is a test post. no title`);
        await admin.firestore().collection("posts").doc(doc.id).delete();
      }
    });
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });
