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

  /**
   * 글 작성 후 이 함수를 호출하면 된다. 그러면 필요한 추가적인 정보를 업데이트한다.
   * @param snapshot 글 snapshot
   * @param uid 회원 uid
   * @returns WriteResult
   */
  static updateMeta(
      snapshot: admin.firestore.QueryDocumentSnapshot
  ): Promise<admin.firestore.WriteResult> {
    const createdAt = admin.firestore.FieldValue.serverTimestamp();
    return snapshot.ref.update({
      createdAt,
    });
  }
}
