import * as functions from "firebase-functions";
import { User } from "../models/user.model";
import { CommentDocument, PostDocument } from "../interfaces/forum.interface";
import { Setting } from "../models/setting.model";
import { Category } from "../models/category.model";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { Upload } from "../models/upload.model";
// import { Storage } from "../models/upload.model";

export const onPostCreate = functions
    .region("asia-northeast3")
    .firestore.document("/posts/{postId}")
    .onCreate((snap) => {
      const futures = [];
      const post = snap.data() as PostDocument;
      futures.push(
          Category.increaseNoOfPosts(post.category),
          Setting.increaseNoOfPosts(),
          Post.updateMeta(snap),
          Upload.setReference(post.files, `/posts/${snap.id}`),
          User.updateUserPostMeta(post.userDocumentReference)
      );
      return Promise.all(futures);
    });

export const onPostUpdate = functions
    .region("asia-northeast3")
    .firestore.document("/posts/{postId}")
    .onUpdate((snap) => {
      const futures = [];
      const after = snap.after;
      const post = after.data() as PostDocument;
      futures.push(
          Post.checkDelete(after),
          Upload.setReference(post.files, `/posts/${after.id}`)
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
          Comment.updateMeta(comment, context.params.commentId),
          Upload.setReference(comment.files, `/comments/${snap.id}`)
      );
      return Promise.all(futures);
    });

export const onCommentUpdate = functions
    .region("asia-northeast3")
    .firestore.document("/comments/{commentId}")
    .onUpdate((snap) => {
      const futures = [];
      const after = snap.after;
      const comment = after.data() as CommentDocument;
      futures.push(
          Comment.checkDelete(after),
          Upload.setReference(comment.files, `/comments/${after.id}`)
      );
      return Promise.all(futures);
    });
