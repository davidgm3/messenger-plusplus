import { signInWithGoogle } from '../../auth/providers';
import { login, logout, setStatus } from './authSlice';
import { FirebaseAuth } from '../../firebase/config';
import { User } from '../../types/types';

//starts the login process with google
export const startSignInWithGoogle = () => {
	return async (dispatch: any) => {
		try {
			//loading status
			dispatch(setStatus('loading'));
			//request data from google
			const req = await signInWithGoogle();
			const { uid, email, displayName, photoURL } = req.user as User;
			//dispatch login action
			dispatch(login({ uid, email, displayName, photoURL }));
			console.log('login success');
		} catch (error) {
			//logout if error
			dispatch(logout());
		}
	};
};

//starts the logout process using firebase
export const startLogout = () => {
	return async (dispatch: any) => {
		dispatch(setStatus('loading'));
		await FirebaseAuth.signOut();
		dispatch(logout());
		console.log('logout success');
	};
};
