import {
	addDoc,
	arrayRemove,
	arrayUnion,
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	updateDoc,
	where,
} from 'firebase/firestore';
import { v4 } from 'uuid';
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from 'firebase/storage';
import { FirebaseDB, FirebaseStorage } from '../firebase/config';
import { Group, Message } from '../types/types';

//Given an image file, group name and members uids it creates a new group
//Returns true if successful, false otherwise
export const createNewGroup = async (
	name: string,
	photo: File,
	members: string[]
): Promise<boolean> => {
	try {
		//Uploads photo to group folder in firebase storage, gets URL
		const photoURL = await uploadGroupPhoto(photo);
		//Throws error if photoURL is null(meaning upload failed)
		if (!photoURL) throw new Error('Error uploading photo');
		//Creates new group in firestore
		await addDoc(collection(FirebaseDB, 'groups'), {
			name,
			photoURL,
			members,
			messages: [],
		});
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

//Given groupId and uid, adds uid to group members
//Returns true if successful, false otherwise
export const joinGroup = async (
	groupId: string,
	uid: string
): Promise<boolean> => {
	try {
		await updateDoc(doc(FirebaseDB, 'groups', groupId), {
			members: arrayUnion(uid),
		});
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

//Given groupId and uid, removes uid from group members
//Returns true if successful, false otherwise
export const removeFromGroup = async (groupId: string, uid: string) => {
	try {
		const docRef = doc(FirebaseDB, 'groups', groupId);
		await updateDoc(docRef, {
			members: arrayRemove(uid),
		});
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const data = docSnap.data();
			const photoURL = data?.photoURL;

			if (data?.members.length === 0) {
				//delete photo from storage
				const photoRef = ref(FirebaseStorage, photoURL);
				await deleteObject(photoRef);
				await deleteDoc(docRef);
			}
		}
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

//Returns groups from a given user
export const getGroupsFromUser = async (uid: string): Promise<Group[]> => {
	try {
		//firebase query to get groups where user is a member
		const q = query(
			collection(FirebaseDB, 'groups'),
			where('members', 'array-contains', uid)
		);
		//Get the docs from the query
		const querySnapshot = await getDocs(q);

		//Define the type of the data
		interface DocData {
			name: string;
			members: string[];
			messages: Message[];
			photoURL: string;
		}

		//Get data, and add to it groupId
		const data: Group[] = querySnapshot.docs.map((doc) => {
			return { ...(doc.data() as DocData), id: doc.id as string };
		});
		return data;
	} catch (e) {
		console.log(e);
		return [];
	}
};

//Given a message object and groupId, it adds the message to the group
//Returns true if successful, false otherwise
type sendNewMessageMessage = {
	content: string;
	senderId: string;
	timestamp: number;
	photo?: File | null;
};
export const sendNewMessage = async (
	message: sendNewMessageMessage,
	groupId: string
) => {
	try {
		//Object for new message
		const newMessage = {
			content: message.content,
			senderId: message.senderId,
			timestamp: message.timestamp,
			photoURL: undefined as string | undefined,
		};
		//Upload photo if it exists
		if (message.photo) {
			console.log('photo exists');
			const photoURL = await uploadChatPhoto(message.photo);
			if (!photoURL) throw new Error('Error uploading photo');
			newMessage['photoURL'] = photoURL;
		}

		//Add message to group messages array
		await updateDoc(doc(FirebaseDB, 'groups', groupId), {
			messages: arrayUnion({
				content: newMessage.content,
				senderId: newMessage.senderId,
				timestamp: newMessage.timestamp,

				photoURL: newMessage.photoURL ? newMessage.photoURL : null,
			}),
		});
		return newMessage;
	} catch (e) {
		console.log(e);
		return false;
	}
};

//Given groupId, returns a group object
//If group doesn't exist, returns null
export const getGroupInfo = async (groupId: string): Promise<Group | null> => {
	try {
		//Ref to the group doc
		const docRef = doc(FirebaseDB, 'groups', groupId);

		//Query the doc
		const docSnap = await getDoc(docRef);

		//If it exists, format data into a group object and return it
		if (docSnap.exists()) {
			const data = docSnap.data();
			if (data) {
				return { ...(data as Group), id: groupId };
			}
		}
		return null;
	} catch (e) {
		console.log(e);
		return null;
	}
};

//Given a picturefile, it uploads it to the group-photos folder in firebase storage
//Returns the url of the uploaded file
//If it fails, returns null
//Will fail if file is not an image
export const uploadGroupPhoto = async (file: File) => {
	try {
		//get mime type of file
		const mimeType = file.type;
		//throw error if file is not an image
		if (mimeType.split('/')[0] !== 'image')
			throw new Error('File is not an image');

		//Upload file to firebase storage, generating a unique name
		const groupPhotosRef = ref(
			FirebaseStorage,
			'group-photos/' + file.name + '-' + Date.now() + v4()
		);
		const snapshot = await uploadBytes(groupPhotosRef, file);

		//Get the url of the uploaded file
		const url = await getDownloadURL(snapshot.ref);
		return url;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const uploadChatPhoto = async (file: File) => {
	try {
		//get mime type of file
		const mimeType = file.type;
		//throw error if file is not an image
		if (mimeType.split('/')[0] !== 'image')
			throw new Error('File is not an image');

		//Upload file to firebase storage, generating a unique name
		const chatPhotosRef = ref(
			FirebaseStorage,
			'chat-photos/' + file.name + '-' + Date.now() + v4()
		);
		const snapshot = await uploadBytes(chatPhotosRef, file);

		//Get the url of the uploaded file
		const url = await getDownloadURL(snapshot.ref);
		return url;
	} catch (e) {
		console.log(e);
		return null;
	}
};
