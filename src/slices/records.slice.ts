import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Record, RecordFromSSR, UserRecords } from "../../shared";

const initialState: UserRecords = {
  index: 0,
  records: [],
};

const records = createSlice({
  initialState,
  name: "userRecords",
  reducers: {
    updateRecords: (_, action: PayloadAction<UserRecords>) => action.payload,
    addRecord: (state, action: PayloadAction<RecordFromSSR>) => ({
      index: state.records.length,
      records: [...state.records, action.payload],
    }),
    selectRecord: (state, action: PayloadAction<number>) => ({
      ...state,
      index: action.payload,
    }),
  },
});

export default records.reducer;
export const { addRecord, updateRecords, selectRecord } = records.actions;
