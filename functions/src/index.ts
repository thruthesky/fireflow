//

import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

exports.updateNoOfUsers = functions.firestore
    .document("/users/{uid}")
    .onCreate((snap, context) => {
    // update noOfUsers field in the document of /settings/counters in firestore
      const doc = admin.firestore().collection("settings").doc("counters");
      return doc.set(
          {
            noOfUsers: admin.firestore.FieldValue.increment(1),
          },
          {merge: true}
      );
    });
