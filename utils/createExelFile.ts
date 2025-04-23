import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

const filePath = path.join("files", "generated_file.xlsx");

export const updateOrCreateUserInExcel = async (user: {
  id: number;
  name: string;
  login: string;
  time: string;
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

      // ✅ Всегда устанавливаем columns
      worksheet.columns = [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Login", key: "login" },
        { header: "Time", key: "time" },
      ];
    } else {
      worksheet = workbook.addWorksheet("Example");
      worksheet.columns = [
        { header: "ID", key: "id" },
        { header: "Name", key: "name" },
        { header: "Login", key: "login" },
        { header: "Time", key: "time" },
      ];
    }

    // Поиск по логину
    const LOGIN_COL = 3;
    let found = false;

    worksheet.eachRow({ includeEmpty: false }, (row) => {
      const loginCell = row.getCell(3).value; // 🔧 Номер столбца с login
      if (loginCell === user.login) {
        row.getCell(2).value = user.name; // Name
        row.getCell(4).value = user.time; // Time
        found = true;
      }
    });

    if (!found) {
      worksheet.addRow(user);
      await workbook.xlsx.writeFile(filePath); // Сохраняем только если был добавлен
    }

    return filePath;
  } catch (error) {
    console.error("Error updating Excel:", error);
    throw error;
  }
};
