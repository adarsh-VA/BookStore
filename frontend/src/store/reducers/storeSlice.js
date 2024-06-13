import { createSlice } from '@reduxjs/toolkit';

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    locations: [], // Array to store books
  },
  reducers: {
    setLocations: (state, action) => {
      state.locations = action.payload;
    },
    allLocations: (state) => {
        return state.locations;
    }
  },
});

export const {  setLocations, allLocations } = storeSlice.actions;
export default storeSlice.reducer;
