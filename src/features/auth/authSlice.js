import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('auth_user'));

const initialState = {
  user: savedUser || null,
  isAuthenticated: !!savedUser,
  registeredUsers: JSON.parse(localStorage.getItem('registered_users')) || [],
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      const newUser = action.payload;
      state.registeredUsers.push(newUser);
      localStorage.setItem('registered_users', JSON.stringify(state.registeredUsers));
    },
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('auth_user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_user');
    },
  },
});

export const { registerUser, loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;