"use client";

import { useState } from "react";
import type { CaseStudyDataset } from "@/data/case-studies-data";

interface Props {
  dataset: CaseStudyDataset;
  filename: string;
  label?: string;
}

export function DownloadXlsxButton({ dataset, filename, label }: Props) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const ExcelJS = (await import("exceljs")).default;
      const wb = new ExcelJS.Workbook();
      wb.creator = "Laboratório de Tesouraria — Prof. José Américo";
      wb.created = new Date();

      for (const table of dataset.tables) {
        // sheet name max 31 chars, no special chars
        const sheetName = table.title
          .replace(/[\\/?*:[\]]/g, " ")
          .slice(0, 31);
        const ws = wb.addWorksheet(sheetName);

        // Title row
        ws.mergeCells(1, 1, 1, table.columns.length + 1);
        const titleCell = ws.getCell(1, 1);
        titleCell.value = table.title;
        titleCell.font = { bold: true, size: 13, color: { argb: "FF00314A" } };
        titleCell.alignment = { horizontal: "left", vertical: "middle" };

        let cursor = 2;
        if (table.subtitle) {
          ws.mergeCells(cursor, 1, cursor, table.columns.length + 1);
          const sub = ws.getCell(cursor, 1);
          sub.value = table.subtitle;
          sub.font = { italic: true, size: 10, color: { argb: "FF555555" } };
          cursor++;
        }
        if (table.unit) {
          ws.mergeCells(cursor, 1, cursor, table.columns.length + 1);
          const u = ws.getCell(cursor, 1);
          u.value = `Unidade: ${table.unit}`;
          u.font = { size: 9, color: { argb: "FF707975" } };
          cursor++;
        }
        cursor++; // blank

        // Header row
        const header = ["", ...table.columns];
        const headerRow = ws.getRow(cursor);
        headerRow.values = header;
        headerRow.eachCell((cell) => {
          cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF00314A" },
          };
          cell.alignment = { horizontal: "center" };
          cell.border = {
            top: { style: "thin", color: { argb: "FFE1E3E4" } },
            bottom: { style: "thin", color: { argb: "FFE1E3E4" } },
          };
        });
        cursor++;

        // Data rows
        for (const row of table.rows) {
          const xRow = ws.getRow(cursor);
          const indent = row.indent ?? 0;
          xRow.getCell(1).value = `${"  ".repeat(indent)}${row.label}`;
          row.values.forEach((v, j) => {
            xRow.getCell(j + 2).value = v;
          });
          if (row.emphasis === "bold" || row.emphasis === "total") {
            xRow.font = { bold: true };
          } else if (row.emphasis === "subtotal") {
            xRow.font = { bold: true };
            xRow.border = {
              top: { style: "thin", color: { argb: "FFBFC9C4" } },
            };
          } else if (row.emphasis === "muted") {
            xRow.font = { italic: true, color: { argb: "FF707975" }, size: 10 };
          }
          if (row.emphasis === "total") {
            xRow.fill = {
              type: "pattern",
              pattern: "solid",
              fgColor: { argb: "FFE7EEF3" },
            };
          }
          // Right-align numeric cells
          for (let j = 2; j <= table.columns.length + 1; j++) {
            const c = xRow.getCell(j);
            if (typeof c.value === "number") {
              c.alignment = { horizontal: "right" };
              c.numFmt = Number.isInteger(c.value)
                ? "#,##0"
                : "#,##0.00";
            }
          }
          cursor++;
        }

        // Column widths
        ws.getColumn(1).width = 42;
        for (let i = 2; i <= table.columns.length + 1; i++) {
          ws.getColumn(i).width = 18;
        }
      }

      const buffer = await wb.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Falha ao gerar Excel:", err);
      alert("Não foi possível gerar o arquivo Excel.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={busy}
      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary font-bold text-sm hover:bg-primary-container transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
    >
      <span className="material-symbols-outlined text-base">download</span>
      {busy ? "Gerando..." : label ?? "Baixar Excel (.xlsx)"}
    </button>
  );
}
