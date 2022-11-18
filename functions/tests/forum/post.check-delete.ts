import "mocha";
import { expect } from "chai";
import * as admin from "firebase-admin";
import { Ref } from "../../src/utils/ref";
import "../firebase.init";

describe("Post.checkDelete", () => {
  it("Create and Delete", async () => {
    await Ref.postCol.add({
      userDocumentReference: Ref.userDoc("test"),
      title: "test",
      content: "test",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      category: "qna",
    });
  });
});
