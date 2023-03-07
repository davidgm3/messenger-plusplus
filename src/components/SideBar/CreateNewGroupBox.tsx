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
		<div className='bg-gray-800 rounded-md flex flex-col p-2 sm:p-3 gap-2 sm:gap-3 justify-start border border-gray-600 cursor-pointer text-sm sm:text-base'>
			<input
				className='bg-gray-700 border border-gray-600 w-full rounded-md flex items-center justify-center outline-none px-4 py-1 placeholder:text-white'
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
					className='py-1 text-sm px-3 w-full bg-gray-700  border border-gray-600 rounded-md'
				/>
			</div>

			<button
				className='bg-gray-700 border border-gray-600 rounded-md font-semibold py-1'
				onClick={handleNewGroup}
			>
				Create new group
			</button>
		</div>
	);
};
