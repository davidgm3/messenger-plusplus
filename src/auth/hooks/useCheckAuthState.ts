import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

import { FirebaseAuth, FirebaseDB } from '../../firebase/config';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { login, logout } from '../../redux/auth/authSlice';
import { reloadGroups } from './../../redux/chat/thunks';
import { collection, DocumentData, onSnapshot } from 'firebase/firestore';
import { AuthState, User } from '../../types/types';

//hook to automate auth state checking and chat reloading when firebase database changes
export const useCheckAuthState = () => {
	const { status } = useAppSelector<AuthState>((state) => state.auth);
	const dispatch = useAppDispatch();

	const [listener, setListener] = useState<DocumentData | null>(null);

	//adds listeners on app load
	useEffect(() => {
		onAuthStateChanged(FirebaseAuth, async (user) => {
			//if user gets logged out from firebase, dispatch logout action
			if (!user) {
				dispatch(logout());
			} else {
				//else, login user
				const { uid, email, displayName, photoURL } = user as User;
				dispatch(
					login({
						uid,
						email,
						displayName,
						photoURL,
					})
				);

				const _listener = onSnapshot(
					collection(FirebaseDB, 'groups'),
					() => {
						dispatch(reloadGroups());
					}
				);
			}
			//load groups from firebase when auth state changes

			dispatch(reloadGroups());

			//add listener to firebase database to reload groups and all related info when related data changes
		});
	}, []);

	return {
		status,
	};
};
