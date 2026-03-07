import { firestore } from "../utils/firebase";
import { fetchUserConfig } from "./config";

export async function create(uid: string, urls: string[]) {
  const config = await fetchUserConfig(uid);

  const results = [];

  for (const url of urls) {
    const docRef = firestore
      .collection("users")
      .doc(uid)
      .collection("transcriptions")
      .doc();

    const transcription = {
      source_url: url,
      status: "pending",
      transcript: null,
      error: null,
      created_at: new Date(),
      updated_at: config.updated_at,
      whisper_version: config.whisper_version,
    };

    await docRef.set(transcription);

    results.push({
      id: docRef.id,
      status: "pending",
    });
  }

  return results;
}

export async function get(uid: string, transcriptionId: string) {
  const docRef = firestore
    .collection("users")
    .doc(uid)
    .collection("transcriptions")
    .doc(transcriptionId);

  const doc = await docRef.get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
}
