import {createSlice} from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: { /* initial state here */ },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        // Add more reducers as needed
    },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
