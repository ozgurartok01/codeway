import axios from "axios";

export interface UserConfig {
  whisper_version: "tiny" | "base";
  updated_at: string;
}

export async function fetchUserConfig(uid: string): Promise<UserConfig> {
  try {
    const response = await axios.get(`http://localhost:4000/v1/config/${uid}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Failed to fetch config for user ${uid}:`,
        error.response?.status,
        error.message,
      );
    } else {
      console.error(`Unexpected error fetching config for user ${uid}:`, error);
    }
    throw new Error(`Config service unavailable for user ${uid}`);
  }
}
