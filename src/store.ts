import {Action, configureStore, ThunkAction} from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import usersListReducer from './slices/usersListSlice';
import salonsReducer from './slices/salonsListSlice';
import messageReducer from './slices/messagesSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        listUsers: usersListReducer,
        salons: salonsReducer,
        messages:messageReducer,
    },
});
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
Action<string>
>;