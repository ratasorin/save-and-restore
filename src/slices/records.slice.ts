import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Record, UserRecords } from "../../shared";

const initialState: UserRecords = {
  index: 0,
  records: [],
};

const records = createSlice({
  initialState,
  name: "userRecords",
  reducers: {
    updateRecords: (_, action: PayloadAction<UserRecords>) => action.payload,
    addRecord: (state, action: PayloadAction<Record>) => ({
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
export const { addRecord, updateRecords } = records.actions;
