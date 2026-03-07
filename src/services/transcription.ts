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

export async function getAll(uid: string, limit: number, cursor?: string) {
  let query = firestore
    .collection("users")
    .doc(uid)
    .collection("transcriptions")
    .orderBy("created_at", "desc")
    .limit(limit);

  if (cursor) {
    const cursorDoc = await firestore
      .collection("users")
      .doc(uid)
      .collection("transcriptions")
      .doc(cursor)
      .get();

    if (cursorDoc.exists) {
      query = query.startAfter(cursorDoc);
    }
  }

  const snapshot = await query.get();

  const results = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const nextCursor =
    snapshot.docs.length === limit
      ? snapshot.docs[snapshot.docs.length - 1].id
      : null;

  return {
    transcriptions: results,
    next_cursor: nextCursor,
  };
}

export async function remove(uid: string, transcriptionId: string) {
  const docRef = firestore
    .collection("users")
    .doc(uid)
    .collection("transcriptions")
    .doc(transcriptionId);

  const doc = await docRef.get();

  if (!doc.exists) {
    return false;
  }

  await docRef.delete();

  return true;
}
