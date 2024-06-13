import { createSlice } from '@reduxjs/toolkit';

const booksSlice = createSlice({
  name: 'books',
  initialState: {
    list: [], // Array to store books
  },
  reducers: {
    setBooks: (state, action) => {
      state.list = action.payload;
    },
    selectBooks: (state) => {
        return state.list;
    },
    deleteBook:(state,action) =>{
      state.list = state.list.filter(item => item._id != action.payload);
    }
  },
});

export const { setBooks, selectBooks, deleteBook } = booksSlice.actions;
export default booksSlice.reducer;
