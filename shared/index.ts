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

export interface RecordFromSSR {
  state: State;
  created_at: string;
}

export interface UserRecords {
  records: RecordFromSSR[];
  index: number;
}
