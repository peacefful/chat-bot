import { createUser } from "../api/createUser";
import { createUniqueUser } from "../api/createUniqueUser";
import { getUserCountry } from "../api/getCountryUser";
import { TUniqueUser } from "../types/user";
import { getUniqueUsers } from "../api/getUniqueUsers";
import { updateUniqueUser } from "../api/updateUser";

export const updateOrCreateUserInExcel = async (user: {
  id: number;
  name: string;
  login: string;
  quetion: string;
}) => {
  try {
    let found = false;
    let currentUserId = "";

    await getUniqueUsers().then(async (users) => {
      const currentUser = users?.find((userItem) => {
        return userItem.login === user.login;
      });

      if (currentUser) {
        found = true;
        currentUserId = currentUser.$id;
      }
    });

    // Формируем дату и время в формате YYYY-MM-DD HH:mm
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const formattedDateTime = `${now.getFullYear()}-${pad(
      now.getMonth() + 1
    )}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    const currentUser: TUniqueUser = {
      id: user.id.toString(),
      name: user.name,
      login: user.login,
      time: formattedDateTime,
    };

    if (!found) {
      await getUserCountry().then(async (region: string | null) => {
        currentUser.region = region;
        currentUser.quetion = user.quetion;

        await createUniqueUser(currentUser);
      });
    } else {
      await getUserCountry().then(async (region: string | null) => {
        currentUser.region = region;
        currentUser.quetion = user.quetion;

        await updateUniqueUser(currentUserId, currentUser);
      });
    }

    await createUser(currentUser);
  } catch (error) {
    console.error("Error updating Excel:", error);
    throw error;
  }
};
