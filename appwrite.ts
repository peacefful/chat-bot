import { Client, Databases } from "appwrite";
import dotenv from "dotenv";

dotenv.config();

export const client = new Client();

client.setEndpoint("https://cloud.appwrite.io/v1");

client.setProject(process.env.APPWRITER_PROJECT_ID || "");

export const database = new Databases(client);
