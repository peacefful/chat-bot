import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { createUser } from "../api/createUser";

const filePath = path.join("files", "generated_file.xlsx");

export const updateOrCreateUserInExcel = async (user: {
  id: number;
  name: string;
  login: string;
}) => {
  try {
    const workbook = new ExcelJS.Workbook();
    let worksheet;

    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const fileExists = fs.existsSync(filePath);
    if (fileExists) {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet("Example");
      if (!worksheet) {
        worksheet = workbook.addWorksheet("Example");
      }
    } else {
      worksheet = workbook.addWorksheet("Example");
    }

    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Login", key: "login" },
      { header: "Time", key: "time" },
    ];

    // Формируем дату и время в формате YYYY-MM-DD HH:mm
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, "0");
    const formattedDateTime = `${now.getFullYear()}-${pad(
      now.getMonth() + 1
    )}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;

    let found = false;

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const loginCell = row.getCell(3).value;
      if (loginCell === user.login) {
        row.getCell(4).value = formattedDateTime;
        found = true;
      }
    });

    if (!found) {
      worksheet.addRow({
        ...user,
        time: formattedDateTime,
      });
    }

    const currentUser = {
      id: user.id.toString(),
      name: user.name,
      login: user.login,
      time: formattedDateTime,
    };

    await createUser(currentUser);
    await workbook.xlsx.writeFile(filePath);
    return filePath;
  } catch (error) {
    console.error("Error updating Excel:", error);
    throw error;
  }
};
