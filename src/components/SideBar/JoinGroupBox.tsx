import { useEffect, useState } from 'react';
import { getUserInfo } from '../../auth/providers';
import { getGroupInfo } from '../../chat/providers';
import { reloadGroups, startJoinGroup } from '../../redux/chat/thunks';
import { useAppDispatch } from '../../redux/hooks';

import { Group, User } from '../../types/types';

export const JoinGroupBox = () => {
	//redux
	const dispatch = useAppDispatch();

	//holds the input value(photo and name)
	const [joinGroupInput, setJoinGroupInput] = useState('');
	const [joinGroupInfo, setJoinGroupInfo] = useState<Group | null>(null);

	//function to handle join group
	const handleJoinGroup = async () => {
		await dispatch(startJoinGroup(joinGroupInput));
		dispatch(reloadGroups());
	};

	//gets group info whenever joinGroupInput changes, to show it
	useEffect(() => {
		if (!joinGroupInput) return;
		getGroupInfo(joinGroupInput).then((data) => {
			setJoinGroupInfo(data);
		});
	}, [joinGroupInput]);

	//holds the members of the possible new group info
	const [membersInfo, setMembersInfo] = useState<User[]>([]);

	const getMembersInfo = async () => {
		//return if there is no potential group
		if (!joinGroupInfo) return;

		//we gather all the members info
		const _membersInfo = await Promise.all(
			joinGroupInfo?.members.map(async (member: any) => {
				//if memberInfo is already in membersInfo, we skip
				if (
					membersInfo.find(
						(memberInfo: any) => memberInfo.uid === member.uid
					)
				)
					return;
				//if not, we get the member info
				const data = await getUserInfo(member);

				return data;
			})
		);

		//persist to state
		setMembersInfo(_membersInfo as User[]);
	};

	//calls getMembersInfo whenever activeGroup changes
	useEffect(() => {
		getMembersInfo();
	}, [joinGroupInfo]);

	return (
		<div className='bg-blue-900 rounded-md flex flex-col p-2 sm:p-3 gap-2 sm:gap-3 justify-start border-2 border-zinc-400 cursor-pointer text-sm sm:text-base'>
			<div className='flex'>
				<input
					className='bg-blue-500 w-full rounded-md flex items-center justify-center outline-none px-4 py-1 placeholder:text-white text-sm sm:text-base'
					type='text'
					placeholder='Enter code invite'
					value={joinGroupInput}
					onChange={(e) => setJoinGroupInput(e.target.value)}
				/>
			</div>
			{joinGroupInfo && (
				<>
					<div>
						Group name:{' '}
						<span className='font-semibold text-sm sm:text-base'>
							{joinGroupInfo.name}
						</span>
					</div>
					<div>
						<>
							Group members:{' '}
							{joinGroupInfo.members.map((member, index) => {
								return (
									membersInfo.find(
										(memberInfo) =>
											memberInfo.uid === member
									)?.displayName +
									(index !== joinGroupInfo.members.length - 1
										? ', '
										: ' ')
								);
							})}
						</>
					</div>
				</>
			)}
			<button
				className='bg-blue-200 text-black font-semibold px-4 py-1 rounded-md'
				onClick={handleJoinGroup}
			>
				Join a group
			</button>
		</div>
	);
};
