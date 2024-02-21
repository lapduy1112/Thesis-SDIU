import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import newsReducer from "./features/news/newsSlice";
import postReducer from "./features/post/postSlice";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import reportReducer from "./features/report/reportSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  account: authReducer,
  news: newsReducer,
  post: postReducer,
  user: userReducer,
  report:reportReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
