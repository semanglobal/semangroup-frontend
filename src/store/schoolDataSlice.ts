import { createSlice } from "@reduxjs/toolkit";
import type { SchoolData } from "../types/schoolDataType";

interface SchoolDataState {
    recordData: SchoolData[];
    loading: boolean;
    error: string | null | undefined;
}

const initialState: SchoolDataState = {
    recordData: [],
    loading: false,
    error: null
}

const SchoolDataSlice = createSlice({
    name: "SchoolData",
    initialState,
    reducers: {
        fetchSchoolDataStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSchoolDataSuccess: (state, action) => {
            state.recordData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchSchoolDataFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSchoolDataStart, fetchSchoolDataSuccess, fetchSchoolDataFailure } = SchoolDataSlice.actions;
export default SchoolDataSlice.reducer;