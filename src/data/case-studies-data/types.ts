export type CellValue = string | number | null;

export type DataRow = {
  label: string;
  values: CellValue[];
  emphasis?: "bold" | "subtotal" | "total" | "muted";
  indent?: 0 | 1 | 2;
};

export type DataTable = {
  id: string;
  title: string;
  subtitle?: string;
  unit?: string;
  columns: string[];
  rows: DataRow[];
};

export type CaseStudyDataset = {
  caseId: string;
  tables: DataTable[];
};
