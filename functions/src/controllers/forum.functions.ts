import * as functions from "firebase-functions";
import { User } from "../models/user.model";
import { CommentDocument, PostDocument } from "../interfaces/forum.interface";
import { Setting } from "../models/setting.model";
import { Category } from "../models/category.model";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";

export const onPostCreate = functions
  .region("asia-northeast3")
  .firestore.document("/posts/{postId}")
  .onCreate((snap) => {
    const futures = [];
    const post = snap.data() as PostDocument;
    futures.push(
      User.increaseNoOfPosts(post.userDocumentReference),
      Category.increaseNoOfPosts(post.category),
      Setting.increaseNoOfPosts(),
      Post.updateMeta(snap)
    );
    return Promise.all(futures);
  });

export const onCommentCreate = functions
  .region("asia-northeast3")
  .firestore.document("/comments/{commentId}")
  .onCreate((snap, context) => {
    const futures = [];
    const comment = snap.data() as CommentDocument;
    futures.push(
      Post.increaseNoOfComments(comment.postDocumentReference),
      User.increaseNoOfComments(comment.userDocumentReference),
      Category.increaseNoOfCommentsFromPostDocumentReference(
        comment.postDocumentReference
      ),
      Setting.increaseNoOfComments(),
      Comment.updateMeta(comment, context.params.commentId)
    );
    return Promise.all(futures);
  });
