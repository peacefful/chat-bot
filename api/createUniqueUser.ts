import { database } from "../appwrite";
import { ID } from "appwrite";
import { type TUniqueUser } from "../types/user";

export const createUniqueUser = async (user: TUniqueUser) => {
  try {
    await database.createDocument(
      process.env.APPWRITER_DATE_BASE_ID || "",
      process.env.APPWRITER_COLLECTION_ACTIVE_USERS_ID || "",
      ID.unique(),
      { ...user }
    );
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
  }
};
