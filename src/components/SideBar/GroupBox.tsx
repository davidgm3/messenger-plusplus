import { Group, User } from '../../types/types';
import { sliceWithEllipsis, timestampToDateTime } from '../../utils/index';
import { useAppDispatch } from '../../redux/hooks';
import { setActiveGroup } from '../../redux/chat/chatSlice';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../auth/providers';
interface Props {
	group: Group;
}

export const GroupBox = ({ group }: Props) => {
	const dispatch = useAppDispatch();

	//holds info of the last user that sent a message
	const [lastUserInfo, setLastUserInfo] = useState<User | null>(null);

	//updates info of the last user that sent a message
	const updateLastUser = async () => {
		const lastMessage = group.messages[group.messages.length - 1];
		if (!lastMessage) return;
		const lastUserInfo = await getUserInfo(lastMessage.senderId);
		if (!lastUserInfo) return;
		setLastUserInfo(lastUserInfo as User);
	};

	//when prop group changes, we update the last user info
	useEffect(() => {
		updateLastUser();
	}, [group]);

	return (
		<div
			key={group.id}
			className='bg-blue-900 rounded-md flex px-3 py-2 gap-3 justify-start border-2 border-zinc-400 cursor-pointer'
			onClick={() => dispatch(setActiveGroup(group.id))}
		>
			<div className='h-12 w-12 shrink-0'>
				<img
					className='h-12 w-12 rounded-full'
					src={group?.photoURL || '/default-group.png'}
					alt=''
				/>
			</div>
			<div className='flex-grow'>
				<div className='font-semibold text-lg'>
					{group.name || 'No name!'}
				</div>
				<div className='flex items-center justify-between w-full'>
					<div className='text-sm'>
						<span className='font-semibold'>
							{lastUserInfo?.displayName &&
								sliceWithEllipsis(
									lastUserInfo?.displayName,
									5
								) + ': '}
						</span>
						<span className='text-xs'>
							{group.messages[group.messages.length - 1]?.content
								? sliceWithEllipsis(
										group.messages[
											group.messages.length - 1
										]?.content,
										10
								  )
								: "It's quiet here..."}
						</span>
					</div>
					<div className='text-xs '>
						{group.messages[group.messages.length - 1]?.timestamp &&
							timestampToDateTime(
								group.messages[group.messages.length - 1]
									?.timestamp
							)}
					</div>
				</div>
			</div>
		</div>
	);
};
