import { createSlice } from "@reduxjs/toolkit";
interface UserType {
  _id: string;
  fullName: string;
  role: string;
}
interface UsersState {
    recordData: UserType[];
    loading: boolean;
    error: string | null | undefined;
}

const initialState: UsersState = {
    recordData: [],
    loading: false,
    error: null
}

const UsersSlice = createSlice({
    name: "Users",
    initialState,
    reducers: {
        fetchUsersStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUsersSuccess: (state, action) => {
            state.recordData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchUsersFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { fetchUsersStart, fetchUsersSuccess, fetchUsersFailure } = UsersSlice.actions;
export default UsersSlice.reducer;