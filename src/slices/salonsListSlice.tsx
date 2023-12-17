import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SalonInfo} from '../model/common';
import {RootState} from "../store";

const initialState = {
    list : [] as SalonInfo[],
}

export const salonListSLice = createSlice({
    name: 'salons',
    initialState,
    reducers: {
        setList : (state, action: PayloadAction<SalonInfo[]> ) =>{
            state.list=action.payload;
        }
    },

});

export const usersListReducer = salonListSLice.reducer;
export const selectSalonsList = (state : RootState)=> state.salons.list;

export default salonListSLice.reducer;