import * as functions from "firebase-functions";
import { User } from "../models/user.model";
import { PostDocument } from "../interfaces/forum.interface";
import { Setting } from "../models/setting.model";
import { Category } from "../models/category.model";

export const onPostCreate = functions
    .region("asia-northeast3")
    .firestore.document("/posts/{postId}")
    .onCreate((snap, context) => {
      const futures = [];

      const post = snap.data() as PostDocument;

      futures.push(
          User.increaseNoOfPosts(post.userDocumentReference),
          Category.increaseNoOfPosts(post.category),
          Setting.increaseNoOfPosts()
      );
      return Promise.all(futures);
    });
