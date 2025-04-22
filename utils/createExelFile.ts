import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const createExcelFile = async () => {
  try {
    // Создаем новый Excel-файл с помощью ExcelJS
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Example");

    // Добавляем заголовки
    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Name", key: "name" },
      { header: "Login", key: "login" },
      { header: "Time", key: "time" },
    ];

    // Добавляем строки с данными
    worksheet.addRow({ id: 1, name: "Item 1", value: "100" });
    worksheet.addRow({ id: 2, name: "Item 2", value: "200" });
    worksheet.addRow({ id: 3, name: "Item 3", value: "300" });

    // Сохраняем файл в директории
    const filePath = path.join(__dirname, "generated_file.xlsx");
    await workbook.xlsx.writeFile(filePath);
    console.log("Excel file created at:", filePath);
    return filePath;
  } catch (error) {
    console.error("Error creating Excel file:", error);
    throw new Error("Failed to create Excel file");
  }
};
