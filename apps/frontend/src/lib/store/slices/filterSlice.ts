import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface FilterSlice {
  minPrice: number;
  maxPrice: number;
}

const initialState: FilterSlice = { minPrice: 0, maxPrice: 9999999 }

export const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setPrice: (state, action: PayloadAction<{ min: number, max: number }>) => {
      state.minPrice = action.payload.min
      state.maxPrice = action.payload.max
    },
  },
});

export const { setPrice } = filterSlice.actions
export default filterSlice.reducer