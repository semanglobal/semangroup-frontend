import { createSlice } from "@reduxjs/toolkit";
import type { SummaryData } from "../types/schoolDataType";

interface SchoolSummaryState {
    recordData: SummaryData;
    loading: boolean;
    error: string | null | undefined;
}

const initialState: SchoolSummaryState = {
    recordData: {
        totalSchools: 0,
        totalStudents: 0,
        totalTeachers: 0,
        totalAdmins: 0,
        growth: {
            students: '',
            teachers: '',
            admins: '',
            overall: ''
        }
    },
    loading: false,
    error: null
}

const SchoolSummarySlice = createSlice({
    name: "SchoolSummary",
    initialState,
    reducers: {
        fetchSchoolSummaryStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchSchoolSummarySuccess: (state, action) => {
            state.recordData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchSchoolSummaryFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchSchoolSummaryStart, fetchSchoolSummarySuccess, fetchSchoolSummaryFailure } = SchoolSummarySlice.actions;
export default SchoolSummarySlice.reducer;