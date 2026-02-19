
export type RowData = Record<string, any>;

export interface SpreadsheetState {
  columns: string[];
  data: RowData[];
}

export interface AIActionResponse {
  updatedData: RowData[];
  explanation: string;
}

export interface AnalysisResponse {
  summary: string;
  insights: string[];
}

export interface Dealer {
  name: string;
  gst: string;
  location: string;
  address?: string;
}

export interface Item {
  name: string;
  hsn: string;
  defaultPrice?: number;
}
