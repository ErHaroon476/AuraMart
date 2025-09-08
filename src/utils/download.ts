export function downloadCSV(filename: string, rows: any[]) {
  if (rows.length === 0) return;

  const replacer = (_key: string, value: any) => (value === null ? "" : value);
  const header = Object.keys(rows[0]);
  const csv = [
    header.join(","),
    ...rows.map((row) =>
      header
        .map((fieldName) => JSON.stringify(row[fieldName], replacer))
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.setAttribute("hidden", "");
  a.setAttribute("href", url);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
