import {
	GoogleAuthProvider,
	signInWithPopup,
	User,
	UserCredential,
} from 'firebase/auth';

import { FirebaseAuth } from '../firebase/config';
import { FirebaseDB } from '../firebase/config';
const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({
	prompt: 'select_account',
});
import {
	getDoc,
	setDoc,
	doc,
	DocumentReference,
	DocumentData,
	DocumentSnapshot,
} from 'firebase/firestore';

//Sign in with google popup
export const signInWithGoogle = async (): Promise<UserCredential> => {
	//signs in with google popup
	const popupRes: UserCredential = await signInWithPopup(
		FirebaseAuth,
		googleAuthProvider
	);

	//ref to user document in firestore
	const docRef: DocumentReference<DocumentData> = doc(
		FirebaseDB,
		'users',
		popupRes.user.uid
	);

	//updates users db with the new user info
	await setDoc(docRef, {
		displayName: popupRes.user.displayName,
		email: popupRes.user.email,
		photoURL: popupRes.user.photoURL,
	});

	return popupRes;
};

//given uid, returns User object
export const getUserInfo = async (uid: string): Promise<User | null> => {
	try {
		//ref to user document in firestore
		const ref = doc(FirebaseDB, 'users', uid);
		//gets user document
		const docSnap: DocumentSnapshot<DocumentData> = await getDoc(ref);

		//if user doesn't exist, return null
		if (!docSnap.exists()) return null;

		//formats data
		const res = {
			...(docSnap.data() as User),
			uid,
		};
		return res;
	} catch (e) {
		return null;
	}
};
