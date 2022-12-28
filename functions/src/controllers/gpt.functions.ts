import * as functions from "firebase-functions";
import { GptDocument } from "../interfaces/gpt.interface";
import { Gpt } from "../models/gpt.model";
// import { Storage } from "../models/upload.model";

export const onGptCreate = functions
    .region("asia-northeast3")
    .firestore.document("/gpt/{documentId}")
    .onCreate((snap) => {
      return Gpt.query(snap.data() as GptDocument, snap.ref);
    });
