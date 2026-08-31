import type { SettingsExportFormat } from "@/types/settings";
import * as XLSX from "xlsx";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function escapeCSVValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  // CSV requires values containing commas, quotes, or newlines
  // to be wrapped in double quotes.
  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

export function exportToCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);

  const csvContent = [
    headers.map(escapeCSVValue).join(","),
    ...data.map((row) =>
      headers.map((header) => escapeCSVValue(row[header])).join(","),
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  downloadBlob(blob, `${filename}.csv`);
}

export function exportToExcel(
  data: Record<string, unknown>[],
  filename: string,
) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Create a worksheet from the data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Create a new workbook
  const workbook = XLSX.utils.book_new();

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  // Generate and download a real .xlsx file
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportData(
  data: Record<string, unknown>[],
  format: SettingsExportFormat,
  filename: string,
) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  if (format === "csv") {
    exportToCSV(data, filename);
    return;
  }

  exportToExcel(data, filename);
}
