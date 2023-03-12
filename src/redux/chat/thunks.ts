import {
	createNewGroup,
	getGroupsFromUser,
	joinGroup,
} from '../../chat/providers';
import {
	pushMessageToActiveGroup,
	setActiveGroup,
	setGroups,
} from './chatSlice';
import {
	sendNewMessage,
	removeFromGroup,
	uploadGroupPhoto,
} from './../../chat/providers';
import { AppDispatch, RootState } from '../store';
import { Message, User } from '../../types/types';

//loads the authenticated user's groups into store

//creates a new message
type startNewMessageProps = {
	content: string;
	senderId: string;
	timestamp: number;
	photo?: File | null;
};
export const startNewMessage = (message: startNewMessageProps) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			//sends message to firestore
			const newMessage = await sendNewMessage(
				message,
				getState().chat.activeGroup?.id || ''
			);
			//pushes message to active group in store
			dispatch(reloadGroups());
		} catch (error) {
			console.log(error);
		}
	};
};

//reloads groups from firestore
export const reloadGroups = () => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			if (!getState().auth.user) {
				dispatch(setGroups([]));
				dispatch(setActiveGroup(null));
				return;
			}
			//gets groups from firestore
			const groups = await getGroupsFromUser(
				getState().auth.user?.uid || ''
			);
			//gets active group id
			const activeGroupId = getState().chat.activeGroup?.id || '';
			//sets groups in store
			dispatch(setGroups(groups));
			dispatch(setActiveGroup(activeGroupId));
			console.log('reload groups');
		} catch (error) {
			console.log(error);
		}
	};
};

//Authenticated user leaves group given groupId
export const startLeaveGroup = (groupId: string) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			//if user is logged in, remove user from group and reload
			const state = getState();
			if (state.auth.user?.uid) {
				await removeFromGroup(groupId, state.auth.user.uid);
				dispatch(reloadGroups());
			}
		} catch (error) {
			console.log(error);
		}
	};
};

//thunk to create a new group
export const startCreateGroup = (name: string, file: File) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			const { uid } = getState().auth.user as User;
			if (name && file && uid) {
				//try to create a new group, if it fails, alert the user
				const success = await createNewGroup(name, file, [uid]);
				if (!success) alert('Please select a valid image format');
			} else {
				alert('Invalid data');
			}
			dispatch(reloadGroups());
		} catch (error) {
			console.log(error);
		}
	};
};

//thunk to join a group
export const startJoinGroup = (groupId: string) => {
	return async (dispatch: AppDispatch, getState: () => RootState) => {
		try {
			const { uid } = getState().auth.user as User;
			//if user is logged and group id is valid, try to join group
			if (groupId && uid) {
				await joinGroup(groupId, uid);
			} else {
				alert('Invalid data');
			}
			dispatch(reloadGroups());
		} catch (error) {
			console.log(error);
		}
	};
};
