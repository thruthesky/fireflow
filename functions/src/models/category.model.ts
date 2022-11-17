import * as admin from "firebase-admin";
import { CategoryDocument, PostDocument } from "../interfaces/forum.interface";
import { Ref } from "../utils/ref";

export class Category {
  /**
   * Returns the category document
   *
   * If the category does not exist, it will return an empty object.
   *
   * @param category category id
   * @returns data object of the category document or null
   */
  static async get(category: string): Promise<CategoryDocument | null> {
    const snapshot = await Ref.categoryCol
        .where("category", "==", category)
        .get();
    if (snapshot.size == 0 || snapshot.docs.length == 0) return null;
    const data = snapshot.docs[0].data() as CategoryDocument;
    data.id = snapshot.docs[0].id;
    return data;
  }

  static async increaseNoOfPosts(
      categoryId: string
  ): Promise<admin.firestore.WriteResult | null> {
    const cat = await this.get(categoryId);
    if (cat == null) return null;
    return Ref.categoryDoc(cat.id).update({
      noOfPosts: admin.firestore.FieldValue.increment(1),
    });
  }

  static async increaseNoOfComments(
      categoryId: string
  ): Promise<admin.firestore.WriteResult | null> {
    const cat = await this.get(categoryId);
    if (cat == null) return null;
    return Ref.categoryDoc(cat.id).update({
      noOfComments: admin.firestore.FieldValue.increment(1),
    });
  }

  static async increaseNoOfCommentsFromPostDocumentReference(
      postDocumentReference: admin.firestore.DocumentReference
  ) {
    const post = (await postDocumentReference.get()).data() as PostDocument;
    return this.increaseNoOfComments(post.category);
  }
}
