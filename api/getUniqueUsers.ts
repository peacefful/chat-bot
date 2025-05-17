import { database } from "../appwrite";

export const getUniqueUsers = async () => {
  try {
    const response = await database.listDocuments(
      process.env.APPWRITER_DATE_BASE_ID || "",
      process.env.APPWRITER_COLLECTION_ACTIVE_USERS_ID || ""
    );

    return response.documents;
  } catch (error) {
    console.error(error);
  }
};
