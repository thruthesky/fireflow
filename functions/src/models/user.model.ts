import * as admin from "firebase-admin";
import { DocumentReference } from "firebase-admin/firestore";
import { UserRecord } from "firebase-functions/v1/auth";
import { UserDocument } from "../interfaces/user.interface";
import { Ref } from "../utils/ref";


/**
 * user_settings field name that will holds the boolean value 
 * when user want to get notified if new comments is created under user created posts/comments
 */
const notifyNewComments = "notify-new-comments";

/**
 * User class
 *
 * It supports user management for cloud functions.
 */
export class User {
  static publicDoc(
    uid: string
  ): admin.firestore.DocumentReference<admin.firestore.DocumentData> {
    return Ref.publicDoc(uid);
  }

  /**
* Create the profile document.
* @param uid uid of the user
* @param data data to update as the user profile
*
*/
  static async create(uid: string, data: any): Promise<UserDocument | null> {
    data.created_time = admin.firestore.FieldValue.serverTimestamp();
    const user = await this.get(uid);
    if (user) throw Error("user-exists");
    data['uid'] = uid;
    await Ref.userDoc(uid).set(data);
    return this.get(uid);
  }

  static async get(uid: string): Promise<UserDocument | null> {
    const snapshot = await Ref.userDoc(uid).get();
    if (snapshot.exists === false) return null;
    return snapshot.data() as UserDocument;
  }

  // / Returns user's point. 0 if it's not exists.
  static async point(uid: string): Promise<number> {
    const data = (
      await Ref.userDoc(uid).collection("user_meta").doc("point").get()
    ).data();
    return data?.point ?? 0;
  }

  /**
   * Returns true if the user has subscribed to the notification when there is a new comment under his post or comment.
   * @param uid user uid
   * @return boolean
   */
  static async commentNotification(uid: string): Promise<boolean> {
    const snapshot = await Ref.userSettingsDoc(uid).get();
    if (snapshot.exists === false) return false;
    const data = snapshot.data();
    if (data === void 0) return false;
    return data[notifyNewComments] ?? false;
  }

  // /**
  //  * Returns true if the user has subscribed to the notification when there is a new comment under his post or comment.
  //  * @param uid user uid
  //  * @returns boolean
  //  */
  // static async chatOtherUserNotification(uid: string, otherUid: string): Promise<boolean> {
  //   const snapshot = await Ref.userSettingsDoc(uid).get();
  //   if (snapshot.exists === false) return false;
  //   const data = snapshot.data();
  //   if (data === void 0) return false;
  //   return data["chatNotify." + otherUid] ?? false;
  // }

  static async getUserByPhoneNumber(
    phoneNumber: string
  ): Promise<UserRecord | null> {
    try {
      const UserRecord = await Ref.auth.getUserByPhoneNumber(phoneNumber);
      return UserRecord;
    } catch (e) {
      return null;
    }
  }

  /**
   * Return true if the user of the uid is an admin. Otherwise false will be returned.
   *
   *
   * @param uid
   */
  static async isAdmin(uid: string): Promise<boolean> {
    if (!uid) return false;

    const doc = await Ref.adminDoc.get();
    const admins = doc.data();
    if (!admins) return false;
    if (!admins[uid]) return false;
    return true;
  }

  /**
   * Check admin. If the user is not admin, then thow an exception of `ERROR_YOU_ARE_NOT_ADMIN`.
   * @param uid the user uid
   * throws error object if there is any error. Or it will return true.
   */
  static async checkAdmin(uid?: string): Promise<boolean> {
    if (typeof uid === "undefined") throw Error("uid is undefined.");
    if (await this.isAdmin(uid)) {
      return true;
    } else {
      throw Error("You are not an admin.");
    }
  }

  /**
   * Disable a user.
   *
   * @param adminUid is the admin uid.
   * @param otherUid is the user uid to be disabled.
   */
  static async disableUser(
    adminUid: string,
    otherUid: string
  ): Promise<UserRecord> {
    this.checkAdmin(adminUid);
    const user = await Ref.auth.updateUser(otherUid, { disabled: true });
    if (user.disabled == true) {
      await Ref.userDoc(otherUid).set({ disabled: true }, { merge: true });
    }
    return user;
  }

  static async enableUser(adminUid: string, otherUid: string) {
    this.checkAdmin(adminUid);
    const user = await Ref.auth.updateUser(otherUid, { disabled: false });
    if (user.disabled == false) {
      await Ref.userDoc(otherUid).set({ disabled: false }, { merge: true });
    }
    return user;
  }

  /**
   * Update user public data document.
   * @param uid user uid
   * @param data user document in /users/{uid}
   * @return promise of write result
   */
  static updatePublicData(
    uid: string,
    data: UserDocument
  ): Promise<admin.firestore.WriteResult> {
    const hasPhoto = !!data.photo_url;
    let complete = false;

    if (data.display_name && data.email && hasPhoto) {
      complete = true;
    }
    //
    delete data.email;
    delete data.phone_number;
    delete data.blockedUserList;
    return User.publicDoc(uid).set(
      {
        ...data,
        isProfileComplete: complete,
        userDocumentReference: Ref.userDoc(uid),
        hasPhoto: hasPhoto,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  }

  static increaseNoOfPosts(
    userDocumentReference: DocumentReference
  ): Promise<admin.firestore.WriteResult> {
    return userDocumentReference.update({
      noOfPosts: admin.firestore.FieldValue.increment(1),
    });
  }

  static increaseNoOfComments(
    userDocumentReference: DocumentReference
  ): Promise<admin.firestore.WriteResult> {
    return userDocumentReference.update({
      noOfComments: admin.firestore.FieldValue.increment(1),
    });
  }

  static async setToken(data: {
    fcm_token: string;
    device_type: string;
    uid: string;
  }): Promise<admin.firestore.WriteResult> {
    return Ref.tokenDoc(data.uid, data.fcm_token).set(data);
  }

  static async setUserSettingsSubscription(
    uid: string,
    data: {
      action?: string,
      category?: string,
      type?: string,
      [key: string]: any;
    }
  ): Promise<admin.firestore.WriteResult> {

    data['userDocumentReference'] = Ref.userDoc(uid);
    return Ref.userSettingDoc(uid).set(data, { merge: true });
  }

}
