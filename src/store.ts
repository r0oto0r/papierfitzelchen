import { configureStore } from '@reduxjs/toolkit'
import brushReducer from './slices/brushSlice';
import colorReducer from './slices/colorSlice';
import pixelGridReducer from './slices/pixelGridSlice';

const store = configureStore({
    reducer: {
        color: colorReducer,
        pixelGrid: pixelGridReducer,
		brush: brushReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
