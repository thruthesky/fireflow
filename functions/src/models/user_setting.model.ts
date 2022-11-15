import * as admin from "firebase-admin";
import { UserDocument } from "../interfaces/user.interface";
import { Ref } from "../utils/ref";

/**
 * User class
 *
 * It supports user management for cloud functions.
 */
export class UserSetting {
  static async get(uid: string): Promise<UserDocument | null> {
    const snapshot = await Ref.userSettingDoc(uid).get();
    if (snapshot.exists === false) return null;
    return snapshot.data() as UserDocument;
  }

  /**
   * Save settings
   * @param uid uid of user
   */
  static async create(
      uid: string,
      type: string
  ): Promise<admin.firestore.WriteResult> {
    return Ref.userSettings.doc().set({
      type: type,
      userDocumentReference: Ref.userDoc(uid),
    });
  }
}
