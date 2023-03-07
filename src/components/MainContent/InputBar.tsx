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
		<div className='bg-gray border-y border-r border-r-gray-600  border-y-gray-600 px-4 py-4 sm:px-8 sm:py-8'>
			<form onSubmit={onSubmit}>
				<input
					ref={inputRef}
					type='text'
					className='w-full bg-gray-800 rounded-md border border-gray-600 px-3 py-1 sm:px-4 sm:py-2 outline-none text-sm sm:text-base text-white'
					placeholder='Type a message'
					value={currInput}
					onChange={(e) => setCurrInput(e.target.value)}
				/>
			</form>
		</div>
	);
};
