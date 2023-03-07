import { useEffect, useState } from 'react';
import { getUserInfo } from '../../auth/providers';
import { startLeaveGroup } from '../../redux/chat/thunks';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { User } from '../../types/types';

export const GroupHeader = () => {
	const dispatch = useAppDispatch();
	//Group state
	const { activeGroup } = useAppSelector((state: RootState) => state.chat);

	//Holds members info -> derived state from activeGroup
	const [membersInfo, setMembersInfo] = useState<any>([]);

	//function to update membersInfo
	const getMembersInfo = async () => {
		//return if there is no activeGroup
		if (!activeGroup) return;

		//we gather all the members info
		const _membersInfo = await Promise.all(
			activeGroup?.members.map(async (member: any) => {
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

		setMembersInfo(_membersInfo);
	};

	//calls getMembersInfo whenever activeGroup changes
	useEffect(() => {
		getMembersInfo();
	}, [activeGroup]);

	//logged in user id
	const uid = useAppSelector((state: RootState) => state.auth.user?.uid);

	const onLeaveGroup = () => {
		if (!activeGroup) return;
		dispatch(startLeaveGroup(activeGroup.id));
	};

	if (!activeGroup) return null;

	return (
		<div className='bg-blue-200 py-2 px-4 border-b-2 border-b-zinc-400 '>
			<div className='flex items-center justify-between'>
				<div>
					<div className='flex items-center'>
						<img
							className='sm:h-12 sm:w-12 h-8 w-8 rounded-full mr-4'
							src={activeGroup.photoURL || '/default-group.png'}
							alt='Group Photo'
						/>
						<h2 className='font-semibold text-md    sm:text-xl'>
							{activeGroup.name}
						</h2>
					</div>
					<div className='text-gray-500 text-sm sm:text-base'>
						<span className='text-black font-semibold'>
							Members:{' '}
						</span>

						{membersInfo.map((member: User, index: number) => {
							if (index > 2) return null;

							return (
								<span key={index}>
									{member.displayName}
									{index === membersInfo.length - 1
										? ''
										: ', '}
								</span>
							);
						})}
						{membersInfo.length > 2 && <span> ...</span>}
					</div>
				</div>
				<div className='flex flex-col gap-2'>
					<div>
						<button
							className='bg-blue-600 font-semibold text-white px-2 py-1 rounded-md text-xs sm:text-sm min-w-max w-full hover:bg-blue-700 transition-colors'
							onClick={() =>
								navigator.clipboard.writeText(activeGroup.id)
							}
						>
							Copy invite code
						</button>
					</div>
					<div>
						<button
							className='bg-red-600 font-semibold text-white px-2 py-1 rounded-md text-xs sm:text-sm min-w-max w-full hover:bg-red-700 transition-colors'
							onClick={() => onLeaveGroup()}
						>
							Leave group
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
