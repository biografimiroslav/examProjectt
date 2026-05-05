import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [
    { id: 1, name: 'Товар 1', price: 100 },
    { id: 2, name: 'Товар 2', price: 200 },
    { id: 3, name: 'Товар 2', price: 200 },
    { id: 4, name: 'Товар 3', price: 300 },
    { id: 5, name: 'Товар 2', price: 200 },
    { id: 6, name: 'Товар 4', price: 400 }, 
            
  ],
  cart: [],
  purchaseHistory: [],
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    addToHistory: (state, action) => {
      state.purchaseHistory.push(action.payload);
      state.cart = []; // Очищуємо кошик після оплати
    },
  },
});

export const { addToCart, addToHistory } = shopSlice.actions;
export default shopSlice.reducer;