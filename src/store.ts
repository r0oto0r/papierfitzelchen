import { configureStore } from '@reduxjs/toolkit'
import colorReducer from './slices/colorSlice';
import pixelGridReducer from './slices/pixelGridSlice';

const store = configureStore({
    reducer: {
        color: colorReducer,
        pixelGrid: pixelGridReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
