import { configureStore } from '@reduxjs/toolkit'
import brushReducer from '../slices/brushSlice';
import colorReducer from '../slices/colorSlice';
import pixelGridReducer from '../slices/pixelGridSlice';
import serverReducer from '../slices/serverSlice';

export const store = configureStore({
    reducer: {
        color: colorReducer,
        pixelGrid: pixelGridReducer,
		brush: brushReducer,
		server: serverReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
