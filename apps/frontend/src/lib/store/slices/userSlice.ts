import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    optimisticTitleAvatar: null,
  },
  reducers: {
    setOptimisticTitleAvatar: (state, action) => {
      state.optimisticTitleAvatar = action.payload;
    },
  },
});

export const { setOptimisticTitleAvatar } = userSlice.actions
export default userSlice.reducer