import * as admin from "firebase-admin";

import { PostDocument } from "../interfaces/forum.interface";


export class Storage {

  static updateMeta(
    snapshot: admin.firestore.QueryDocumentSnapshot
  ): any {

    const post = snapshot.data() as PostDocument;

    if (post.files.length == 0) return null;

    for (let file in post.files) {
      let url_token = file.split('?');
      let url = url_token[0].split('/');
      let filePath = url[url.length - 1].replaceAll("%2F", "/");

      // Create reference to the file whose metadata we want to change
      // let forestRef =  admin.firestore.storage.child(`${post.userDocumentReference.path}/uploads/${filePath}`);

      // Create file metadata to update
      // final newMetadata = SettableMetadata(
      //   cacheControl: "public,max-age=300",
      //   type: "post",
      // );

      // // Update metadata properties
      // final metadata = await forestRef.updateMetadata(newMetadata);
    }



    return null;
  }

}
