import { Group, User } from '../../types/types';
import { sliceWithEllipsis, timestampToDateTime } from '../../utils/index';
import { useAppDispatch } from '../../redux/hooks';
import { setActiveGroup } from '../../redux/chat/chatSlice';
import { useEffect, useState } from 'react';
import { getUserInfo } from '../../auth/providers';
interface Props {
	group: Group;
	onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export const GroupBox = ({ group, onClick }: Props) => {
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
			onClick={(e) => {
				dispatch(setActiveGroup(group.id));
				if (typeof onClick === 'function') {
					onClick(e);
					console.log('click');
				}
			}}
		>
			<div className='h-10 w-10 sm:h-12 sm:w-12 shrink-0'>
				<img
					className=' h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover'
					src={group?.photoURL || '/default-group.png'}
					alt=''
				/>
			</div>
			<div className='flex-grow'>
				<div className='font-semibold sm:text-lg'>
					{group.name || 'No name!'}
				</div>
				<div className='flex items-center justify-between w-full'>
					<div className='text-xs sm:text-sm'>
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
