import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Message} from '../model/common';
import {RootState} from "../store";
import {Dispatch} from "react";

const initialState = {
    list: [] as Message[],
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessagesList: (state, action: PayloadAction<Message[]>) => {
            state.list = action.payload;
        },
    },
});

export const { setMessagesList } = messagesSlice.actions;
export const updateMessagesList = (messages: Message[]) => (dispatch: Dispatch<any>) => {
    dispatch(setMessagesList(messages));
};
// Utilisation de "any" pour spécifier le type de state
export const messagesList = (state : RootState)=> state.messages.list;
export default messagesSlice.reducer;
