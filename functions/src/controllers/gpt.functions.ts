import * as functions from "firebase-functions";
import { User } from "../models/user.model";
import { CommentDocument, PostDocument } from "../interfaces/forum.interface";
import { Setting } from "../models/setting.model";
import { Category } from "../models/category.model";
import { Post } from "../models/post.model";
import { Comment } from "../models/comment.model";
import { Upload } from "../models/upload.model";
// import { Storage } from "../models/upload.model";

export const onGptCreate = functions
  .region("asia-northeast3")
  .firestore.document("/gpt/{documentId}")
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
