import type { CaseStudyDataset } from "./types";
import { CS1_DATA } from "./cs1";
import { CS2_DATA } from "./cs2";
import { CS3_DATA } from "./cs3";
import { CS4_DATA } from "./cs4";
import { CS5_DATA } from "./cs5";

export const CASE_STUDY_DATA: Record<string, CaseStudyDataset> = {
  cs1: CS1_DATA,
  cs2: CS2_DATA,
  cs3: CS3_DATA,
  cs4: CS4_DATA,
  cs5: CS5_DATA,
};

export type { CaseStudyDataset, DataTable, DataRow, CellValue } from "./types";
