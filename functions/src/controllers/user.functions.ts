import * as functions from "firebase-functions";
import { UserDocument } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { Setting } from "../models/setting.model";
import { UserSetting } from "../models/user_setting.model";
import { Chat } from "../models/chat.model";
import { Upload } from "../models/upload.model";
export const onUserCreate = functions
    .region("asia-northeast3")
    .firestore.document("/users/{uid}")
    .onCreate((snap, context) => {
      const futures = [];
      const data = snap.data() as UserDocument;
      futures.push(
          Setting.increaseNoOfUsers(),
          User.updatePublicData(context.params.uid, data),
          UserSetting.create(context.params.uid, "settings"),
          Chat.sendWelcomeMessage(context.params.uid)
      );
      return Promise.all(futures);
    });

export const onUserUpdate = functions
    .region("asia-northeast3")
    .firestore.document("/users/{uid}")
    .onUpdate((snap, context) => {
      const futures = [];
      const data = snap.after.data() as UserDocument;
      futures.push(
          User.updatePublicData(context.params.uid, data),
          User.command(context.params.uid, data),

          Upload.setReference(
              data.photo_url ?? "",
              `/users/${snap.after.id}`,
              "profilePhoto"
          ),
          Upload.setReference(
              data.coverPhotoUrl ?? "",
              `/users/${snap.after.id}`,
              "coverPhoto"
          )
      );
      return Promise.all(futures);
    });
