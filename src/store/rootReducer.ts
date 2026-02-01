
import { combineReducers } from "@reduxjs/toolkit";

import UsersSlice from "./userSlice";
import SchoolDataSlice from "./schoolDataSlice";
import SchoolSummarySlice from "./schoolSummarySlice"

export const rootReducer = combineReducers({
  getUsers: UsersSlice,
  getSchoolData: SchoolDataSlice,
  getSchoolSummary: SchoolSummarySlice,
});