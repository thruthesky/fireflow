import "../tests/firebase.init";
import * as admin from "firebase-admin";
import { User } from "../src/models/user.model";

// Get user documents under the collection 'users' in the Firestore database and log them to the console.
admin
  .firestore()
  .collection("users")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      // console.log(doc.id, "=>", doc.data());

      const data = doc.data();
      if (
        (data.email === void 0 ||
          data.phone_number === void 0 ||
          data.uid === void 0) &&
        data.display_name === void 0
      ) {
        User.deleteAccount(doc.id);
        console.log(
          `${data.uid} is a test acccount. display_name, and email or phone_number is undefined`
        );
      }
    });
  })
  .catch((err) => {
    console.log("Error getting documents", err);
  });
