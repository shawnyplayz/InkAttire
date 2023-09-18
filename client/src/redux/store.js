import { legacy_createStore as createStore, combineReducers } from "redux";
import reducer from "./reducer";
import loadingReducer from "./loadingReducer/reducer";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "user",
  storage: storage,
  whitelist: ["universalReducer"],
};
const rootReducer = combineReducers({
  universalReducer: reducer,
  loadingReducer: loadingReducer,
});
const reduxPersist = persistReducer(authPersistConfig, rootReducer);
export const store = createStore(
  // rootReducer,
  reduxPersist,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export const persistor = persistStore(store);
