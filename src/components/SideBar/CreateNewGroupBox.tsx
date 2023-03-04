import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { User } from '../../types/types';
import { startCreateGroup } from './../../redux/chat/thunks';

export const CreateNewGroupBox = () => {
	//redux
	const dispatch = useAppDispatch();
	const authInfo = useAppSelector((state: RootState) => state.auth);

	//holds the new group name
	const [newGroupInput, setNewGroupInput] = useState('');

	//holds the new group photo
	const [newGroupPhoto, setNewGroupPhoto] = useState<File | null>(null);

	//function to create a new group
	const handleNewGroup = async () => {
		const { uid } = authInfo.user as User;
		if (!newGroupPhoto || !newGroupInput) return;
		dispatch(startCreateGroup(newGroupInput, newGroupPhoto));
		//reset inputs
		setNewGroupInput('');
		setNewGroupPhoto(null);
	};
	return (
		<div className='bg-blue-900 rounded-md flex flex-col p-3 gap-3 justify-start border-2 border-zinc-400 cursor-pointer'>
			<input
				className='bg-blue-500 w-full rounded-md flex items-center justify-center outline-none px-4 py-1 placeholder:text-white'
				type='text'
				placeholder='Enter group name'
				value={newGroupInput}
				onChange={(e) => setNewGroupInput(e.target.value)}
			/>
			<div>
				<label>Select a group picture</label>
				<input
					name='photo'
					type='file'
					onChange={(e) => {
						if (e.target.files) {
							setNewGroupPhoto(e.target.files[0]);
						}
					}}
					className='py-1 text-sm px-3 w-full bg-blue-500 rounded-md'
				/>
			</div>

			<button
				className='bg-blue-200 text-black rounded-md font-semibold py-1'
				onClick={handleNewGroup}
			>
				Create new group
			</button>
		</div>
	);
};
