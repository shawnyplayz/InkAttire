import { legacy_createStore as createStore, combineReducers } from "redux";
import reducer from "./reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "user",
  storage: storage,
  whitelist: ["universalReducer"],
};
const rootReducer = combineReducers({ universalReducer: reducer });
const reduxPersist = persistReducer(authPersistConfig, rootReducer);
export const store = createStore(
  reduxPersist,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export const persistor = persistStore(store);
