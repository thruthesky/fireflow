import * as admin from "firebase-admin";
import { PostDocument } from "../interfaces/forum.interface";
import { Ref } from "../utils/ref";

export class Post {
  /**
   * Returns the post document in `PostDocument` format.
   *
   * If the post does not exist, it will return an empty object.
   *
   * @param id post id
   * @returns data object of the post document
   */
  static async get(id: string): Promise<PostDocument> {
    const snapshot = await Ref.postDoc(id).get();
    if (snapshot.exists == false) return {} as PostDocument;
    const data = snapshot.data() as PostDocument;
    data.id = id;
    return data;
  }

  static increaseNoOfComments(
      postDocumentReference: admin.firestore.DocumentReference
  ): Promise<admin.firestore.WriteResult> {
    return postDocumentReference.update({
      noOfComments: admin.firestore.FieldValue.increment(1),
    });
  }
}
