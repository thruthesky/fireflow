import * as functions from "firebase-functions";
import {UserDocument} from "../interfaces/user.interface";
import {User} from "../models/user.model";
import {Setting} from "../models/setting.model";
export const onUserCreate = functions.firestore
    .document("/users/{uid}")
    .onCreate((snap, context) => {
      const futures = [];
      futures.push(
          Setting.increaseNoOfUsers(),
          User.updatePublicData(context.params.uid, snap.data() as UserDocument)
      );
      return Promise.all(futures);
    });

export const onUserUpdate = functions.firestore
    .document("/users/{uid}")
    .onUpdate((snap, context) => {
      const futures = [];
      futures.push(
          User.updatePublicData(
              context.params.uid,
        snap.after.data() as UserDocument
          )
      );
      return Promise.all(futures);
    });
