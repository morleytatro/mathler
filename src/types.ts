type HistoryEntry = {
  date: string;
  won?: boolean;
  answer: number;
  map: Record<string, number[]>;
  reversed?: (string | number)[];
};

export type Metadata = {
  history: HistoryEntry[];
};
