export interface Message {
	content: string;
	senderId: string;
	timestamp: number;
	photoURL?: string;
}

export interface Group {
	id: string;
	photoURL: string;
	name: string;
	members: string[];
	messages: Message[];
}

export interface ChatState {
	groups: Group[];
	activeGroup: Group | null;
}

export interface User {
	uid: string;
	displayName: string;
	email: string;
	photoURL: string;
}
export interface AuthState {
	user: User | null;
	status: 'loggedIn' | 'loading' | 'loggedOut';
}
