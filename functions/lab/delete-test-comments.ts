import "../tests/firebase.init";
import * as admin from "firebase-admin";

(async () => {
  // Get user documents under the collection 'users' in the Firestore database and log them to the console.
  const snapshot = await admin.firestore().collection("posts").get();

  // get document in an array from snapshot
  const docs = snapshot.docs;

  // get document id in an array from docs
  const postIds = docs.map((doc) => doc.id);
  console.log(postIds);

  // Get all comments docuemnts under the collection 'comments' in the Firestore database and log them to the console.
  const snapshot2 = await admin.firestore().collection("comments").get();
  const comments = snapshot2.docs;
  for (const comment of comments) {
    const data = comment.data();
    if (postIds.includes(data.postDocumentReference.id)) {
      console.log(`the parent of ${comment.id} exists.`);
      // await admin.firestore().collection("comments").doc(comment.id).delete();
    } else {
      console.log("The parent post of the comment does not exists.");
      await admin.firestore().collection("comments").doc(comment.id).delete();
    }
  }
})();
