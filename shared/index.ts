export interface State {
  title: string;
  color: string;
}

export interface RecordDB {
  state: string;
  created_at: Date;
}

export interface Record {
  state: State;
  created_at: Date;
}

export interface UserRecords {
  records: Record[];
  index: number;
}
