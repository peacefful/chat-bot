import { database } from "../appwrite";
import { type TUniqueUser } from "../types/user";

export const updateUniqueUser = async (id: string, user: TUniqueUser) => {
  try {
    await database.updateDocument(
      process.env.APPWRITER_DATE_BASE_ID || "",
      process.env.APPWRITER_COLLECTION_ACTIVE_USERS_ID || "",
      id,
      user
    );
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
  }
};
