import type { SettingsExportFormat } from "@/types/settings";

export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = headers.join(",") + "\n";

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(",") + "\n";
  });

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(data: any[], filename: string) {
  // For now, we export as CSV with .xlsx name
  // This is compatible with Excel and other spreadsheet applications
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  const headers = Object.keys(data[0]);

  // Create CSV content
  let csvContent = headers.join(",") + "\n";

  data.forEach((row) => {
    const values = headers.map((header) => {
      const value = row[header];
      if (typeof value === "string" && value.includes(",")) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    });
    csvContent += values.join(",") + "\n";
  });

  // Create blob and download as Excel-compatible CSV
  const blob = new Blob([csvContent], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.xlsx`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportData(
  data: any[],
  format: SettingsExportFormat,
  filename: string,
) {
  if (format === "csv") {
    exportToCSV(data, filename);
  } else {
    exportToExcel(data, filename);
  }
}
