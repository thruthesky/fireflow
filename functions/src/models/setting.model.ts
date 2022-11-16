import * as admin from "firebase-admin";

/**
 * User class
 *
 * It supports user management for cloud functions.
 */
export class Setting {
  static get counters() {
    return admin.firestore().collection("settings").doc("counters");
  }

  /**
   * update noOfUsers field in the document of /settings/counters in firestore
   * @return promise of write result
   */
  static increaseNoOfUsers(): Promise<admin.firestore.WriteResult> {
    return this.counters.set(
      {
        noOfUsers: admin.firestore.FieldValue.increment(1),
      },
      { merge: true }
    );
  }
}
