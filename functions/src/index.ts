import * as admin from "firebase-admin";

admin.initializeApp();

admin.firestore().settings({ ignoreUndefinedProperties: true });

export * from "./controllers/user.functions";
export * from "./controllers/user_presence.functions";
export * from "./controllers/forum.functions";
export * from "./controllers/chat.functions";
export * from "./controllers/messaging.functions";
export * from "./controllers/gpt.functions";
