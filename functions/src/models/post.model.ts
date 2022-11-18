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
  /**
   * 만약, 글이 삭제되었으면, noOfComment 가 0 이면, 문서 삭제. 아니면 내용 삭제.
   * @param after 글 after snapshot
   */
  static checkDelete(
    after: admin.firestore.QueryDocumentSnapshot
  ): Promise<admin.firestore.WriteResult> | null {
    const data = after.data() as PostDocument;
    if (data.deleted) {
      console.log("--> post deleted. going to delete the document");
      if (!data.noOfComments || data.noOfComments == 0) {
        return after.ref.delete();
      } else {
        if (data.files && data.files.length > 0) {
          // delete files in firebase storage from data.files array
          // 여기서 부터... 파일 삭제 확인.
          // @TODO 테스트를 추가해서 확인 할 것.
          for (const url of data.files) {
            const token = url.split("?");
            const parts = token[0].split("/");
            const path = parts[parts.length - 1].replace(/%2F/gi, "/");
            const fileRef = admin.storage().bucket().file(path);
            fileRef.delete();
          }
        }
        return after.ref.update({
          title: "",
          content: "",
          files: [],
        });
      }
    } else {
      console.log("--> post not deleted.");
      return null;
    }
  }
}
