import { createSlice } from '@reduxjs/toolkit';
import { AuthState, User } from '../../types/types';

//initial auth state
const initialState: AuthState = {
	user: null,
	status: 'loading',
};

//redux slice
export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		login: (state: AuthState, action: { payload: User }) => {
			state.user = action.payload;
			state.status = 'loggedIn';
		},
		logout: (state: AuthState) => {
			state.user = null;
			state.status = 'loggedOut';
		},
		setStatus(
			state: AuthState,
			action: { payload: 'loggedIn' | 'loading' | 'loggedOut' }
		) {
			state.status = action.payload;
		},
	},
});

export const { login, logout, setStatus } = authSlice.actions;
