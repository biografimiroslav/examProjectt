import { createSlice } from '@reduxjs/toolkit';

const getSavedData = (key) => JSON.parse(localStorage.getItem(key)) || [];

const initialState = {
  products: [
        { id: 1, name: 'Ігровий ПК', price: 45000, desc: 'Intel Core i7 / RTX 4070 / 32GB RAM' },
        { id: 2, name: 'Ігровий ПК', price: 35000, desc: 'AMD Ryzen 5 / RTX 3060 / 16GB RAM' },
        { id: 3, name: 'Ігровий П', price: 25000, desc: 'Intel Core i5 / GTX 1660 / 8GB RAM' },
        { id: 4, name: 'Ігровий ПК', price: 60000, desc: 'AMD Ryzen 9 / RTX 4090 / 64GB RAM' },
        { id: 5, name: 'Ігровий ПК', price: 30000, desc: 'Intel Core i5 / RTX 3060 / 16GB RAM' },
         { id: 6, name: 'Ігровий ПК', price: 20000, desc: 'AMD Ryzen 3 / GTX 1650 / 8GB RAM' },
  ],
  cart: getSavedData('user_cart'),
  purchaseHistory: getSavedData('purchase_history'),
};

export const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cart = [action.payload]; 
      localStorage.setItem('user_cart', JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = [];
      localStorage.removeItem('user_cart');
    },
    addToHistory: (state, action) => {
      state.purchaseHistory.push(action.payload);
      localStorage.setItem('purchase_history', JSON.stringify(state.purchaseHistory));
      state.cart = [];
      localStorage.removeItem('user_cart');
    },
  },
});

export const { addToCart, clearCart, addToHistory } = shopSlice.actions;
export default shopSlice.reducer;