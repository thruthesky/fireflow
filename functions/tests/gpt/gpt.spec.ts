import "mocha";
import "../firebase.init";

import { expect } from "chai";
import * as admin from "firebase-admin";
import { Gpt } from "../../src/models/gpt.model";
import { GptDocument } from "../../src/interfaces/gpt.interface";

describe("GPT", () => {
  it("Gpt.query()", async () => {
    const ref = await admin.firestore().collection("gpt").add({
      model: "text-davinci-003",
      prompt: "지금 한국의 날씨는 어때요?",
      max_tokens: 256,
      temperature: 0.5,
    });
    const snapshot = await ref.get();
    await Gpt.query(snapshot.data() as GptDocument, snapshot.ref);
    const finalSnapshot = await ref.get();
    console.log(finalSnapshot.data());
    expect(finalSnapshot.data()?.result).equals("success");
  });
});
