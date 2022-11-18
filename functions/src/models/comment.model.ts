import { CommentDocument } from "../interfaces/forum.interface";
import { Ref } from "../utils/ref";
import { Library } from "../utils/library";
import { Post } from "./post.model";

export class Comment {
  static async get(id: string): Promise<CommentDocument | null> {
    const snapshot = await Ref.commentDoc(id).get();
    if (snapshot.exists === false) return null;
    const data = snapshot.data() as CommentDocument;
    data.id = id;
    return data;
  }

  // get comment ancestor by getting parent comment until it reach the root comment
  // return the uids of the author

  /**
   * Return an array of user uid of the ancestors of the comment id.
   * @param commentId comment id to get the ancestor's uid
   * @param authorUid the user uid of the comment id. If it is set, then the anotherUid will not be included in the result uid array. It should be the author uid of the commentId. But It can be any uid.
   * @returns Returns the uid of ancestors.
   */
  static async getAncestorsUid(
    commentId: string,
    authorUid?: string
  ): Promise<string[]> {
    let comment = await Comment.get(commentId);
    const uids = [comment?.userDocumentReference.id];
    while (
      comment?.parentCommentDocumentReference &&
      comment.postDocumentReference.id !=
        comment.parentCommentDocumentReference.id
    ) {
      comment = await Comment.get(comment!.parentCommentDocumentReference.id);
      if (comment == null) break;
      uids.push(comment?.userDocumentReference.id);
    }
    // return uids.filter((v, i, a) => a.indexOf(v) === i); // remove duplicate

    // remove duplicates and remove authorUid
    return [...new Set(uids)].filter((v) => v != authorUid) as string[];
  }

  /**
   * 코멘트가 작성되면, 코멘트의 dpeth 와 order 를 업데이트하여, 트리 구조 목록과 들여쓰기를 할 수 있도록 한다.
   *
   * 참고, 글에 noOfComments 는 다른 곳에서 업데이트하고 있다.
   *
   * @param comment 코멘트 문서
   * @param commentId 코멘트 문서 id
   * @returns
   */
  static async updateMeta(comment: CommentDocument, commentId: string) {
    const post = await Post.get(comment.postDocumentReference.id);
    let parent;
    if (comment.parentCommentDocumentReference) {
      parent = await Comment.get(comment.parentCommentDocumentReference.id);
    }
    const order = Library.commentOrder(
      parent?.order,
      parent?.depth,
      post.noOfComments
    );
    return Ref.commentDoc(commentId).update({
      depth: parent?.depth ? parent.depth + 1 : 1,
      order: order,
    });
  }
}
