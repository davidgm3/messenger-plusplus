import { newMessage } from '../../redux/chat/thunks';
import { useAppDispatch, useAppSelector } from './../../redux/hooks';
import { useRef, useState } from 'react';
import { RootState } from '../../redux/store';

export const InputBar = () => {
	const dispatch = useAppDispatch();

	//message input state
	const [currInput, setCurrInput] = useState('');

	//logged in user id
	const uid = useAppSelector((state: RootState) => state.auth.user?.uid);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		//if input is empty, do nothing
		if (!currInput) return;

		//send message via redux thunk
		dispatch(
			newMessage({
				content: currInput,
				senderId: uid as string,
				timestamp: new Date().getTime(),
			})
		);
		//clear input
		setCurrInput('');

		//unfocus input
		inputRef.current?.blur();
	};
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<div className='bg-blue-200 border-y-2 border-r-2 border-r-zinc-400  border-y-zinc-400 px-8 py-8'>
			<form onSubmit={onSubmit}>
				<input
					ref={inputRef}
					type='text'
					className='w-full bg-white rounded-md border-2 border-zinc-400 px-4 py-2 outline-none'
					placeholder='Type a message'
					value={currInput}
					onChange={(e) => setCurrInput(e.target.value)}
				/>
			</form>
		</div>
	);
};
