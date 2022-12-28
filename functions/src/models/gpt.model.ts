import * as admin from "firebase-admin";
import { Configuration, OpenAIApi } from "openai";
import { GptDocument } from "../interfaces/gpt.interface";

import keys from "../../../keys/keys.json";

export class Gpt {
  static async query(
    data: GptDocument,
    ref: FirebaseFirestore.DocumentReference
  ): Promise<void> {
    const configuration = new Configuration({
      apiKey: keys.openAiKey,
    });

    const openai = new OpenAIApi(configuration);
    const queryStartedAt = admin.firestore.FieldValue.serverTimestamp();
    try {
      const completion = await openai.createCompletion(
        {
          model: data.model,
          prompt: data.prompt,
          max_tokens: data.max_tokens,
          temperature: data.temperature,
        },
        {
          timeout: 60000,
        }
      );
      console.log(completion.data.choices[0].text);
      await ref.update({
        result: "success",
        queryStartedAt: queryStartedAt,
        queryFinishedAt: admin.firestore.FieldValue.serverTimestamp(),
        ...completion.data.choices[0],
        ...completion.data.usage,
        id: completion.data.id,
        object: completion.data.object,
        created: completion.data.created,
      });
    } catch (error: any) {
      let message = "";
      if (error.response) {
        // console.log(error.response.status);
        // console.log(error.response.data);
        const obj = JSON.stringify(error.response.data);
        message = `error response; status: ${error.response.status} error data: ${obj}`;
      } else {
        console.log(error.message);
        message = error.message;
      }
      await ref.update({
        result: "failure",
        message: message,
        queryStartedAt: queryStartedAt,
        queryFinishedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
}
