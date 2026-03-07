import { firestore } from "../utils/firebase";

export async function remove(uid: string) {
  const transcriptionsRef = firestore
    .collection("users")
    .doc(uid)
    .collection("transcriptions");

  const snapshot = await transcriptionsRef.get();
  const deletePromises = snapshot.docs.map((doc) => doc.ref.delete());

  await Promise.all(deletePromises);
  await firestore.collection("users").doc(uid).delete();

  return {
    deletedTranscriptions: snapshot.size,
  };
}
