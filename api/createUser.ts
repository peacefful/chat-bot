import { database } from "../appwrite";
import { ID } from "appwrite";
import { type TUser } from "../types/user";

export const createUser = async (user: TUser) => {
  try {
    const response = await database.createDocument(
      process.env.APPWRITER_DATE_BASE_ID || "",
      process.env.APPWRITER_COLLECTION_ID || "",
      ID.unique(),
      { ...user }
    );
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
  }
};
