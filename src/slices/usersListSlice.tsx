import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserInfo} from '../model/common';
import {RootState} from "../store";

const initialState = {
    list: [] as UserInfo[],
};

export const usersListSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<UserInfo[]>) => {
            state.list = action.payload;
        },
    },
});

export const { setList } = usersListSlice.actions;

// Utilisation de "any" pour spécifier le type de state
export const selectUsersList = (state : RootState)=> state.listUsers.list;
export default usersListSlice.reducer;
