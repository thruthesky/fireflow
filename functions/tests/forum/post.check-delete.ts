import "mocha";
import { expect } from "chai";
import * as admin from "firebase-admin";
import { Ref } from "../../src/utils/ref";
import "../firebase.init";
import { Library } from "../../src/utils/library";
import { PostDocument } from "../../src/interfaces/forum.interface";
import { Post } from "../../src/models/post.model";

const testUid = "9SIE4SCvLdOID7KICjwoou6k0yj2";

describe("Post.checkDelete", () => {
  it("Create and Delete", async () => {
    console.log("--> create a post");
    const ref = await Ref.postCol.add({
      userDocumentReference: Ref.userDoc(testUid),
      title: "title",
      content: "content",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      category: "qna",
    });
    console.log("--> delay 1.5 seconds");
    await Library.delay(1500);
    const doc = await ref.get();
    const post = doc.data() as PostDocument;
    expect(post).to.be.an("object");
    console.log(post);

    Post.checkDelete(doc as admin.firestore.QueryDocumentSnapshot);
  });
});
