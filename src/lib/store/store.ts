import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import filterReducer from "./slices/filterSlice"
import userReducer from "./slices/userSlice"

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      filter: filterReducer,
      user: userReducer,
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']