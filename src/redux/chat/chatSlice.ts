import { createSlice } from '@reduxjs/toolkit';
import { ChatState, Group, Message } from '../../types/types';

//initial chat state
const initialState: ChatState = {
	groups: [],
	activeGroup: null,
};

//redux slice
export const chatSlice = createSlice({
	name: 'chat',
	initialState,
	reducers: {
		setGroups(state: ChatState, action: { payload: Group[] }) {
			state.groups = action.payload;
		},
		addGroup(state: ChatState, action: { payload: Group }) {
			state.groups.push(action.payload);
		},
		setActiveGroup(state: ChatState, action: { payload: string }) {
			state.activeGroup =
				state.groups.find((group) => group.id === action.payload) ||
				null;
		},
		pushMessageToActiveGroup(
			state: ChatState,
			action: { payload: Message }
		) {
			state.activeGroup?.messages.push(action.payload);
		},
	},
});

export const { setGroups, addGroup, setActiveGroup, pushMessageToActiveGroup } =
	chatSlice.actions;
