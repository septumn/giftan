import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: any[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        existingItem.amount += 1;
      } else {
        state.items.push({ ...action.payload, amount: 1, selected: false });
      }

      console.log(state.items)
    },
    deleteFromCart: (state, action: PayloadAction<any>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (!existingItem) return;

      if (existingItem.amount > 1) {
        existingItem.amount -= 1;
      } else {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      }
    },
    toggleSelect: (state, action: PayloadAction<string | number>) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        item.selected = !item.selected;
      }
    },
  },
});

export const { addToCart, deleteFromCart, toggleSelect } = cartSlice.actions;
export default cartSlice.reducer;