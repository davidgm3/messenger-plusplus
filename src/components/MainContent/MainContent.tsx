import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { NoGroup } from './NoGroup';
import { InputBar } from './InputBar';
import { GroupHeader } from './GroupHeader';
import { Message, User } from './../../types/types';
import { MessageBox } from './MessageBox';
import { useRef, useEffect, useState } from 'react';
import { getUserInfo } from '../../auth/providers';

export const MainContent = () => {
	const chatInfo = useAppSelector((state: RootState) => state.chat);

	//holds messages box ref
	const messagesBox = useRef<HTMLDivElement>(null);

	//scrolls to bottom of messages box
	const scrollToBottom = () => {
		messagesBox.current?.scrollTo({
			top: 9007199254740991,
			behavior: 'smooth',
		});
	};

	const scrollToBottomNoAnim = () => {
		messagesBox.current?.scrollTo({
			top: 9007199254740991,
			behavior: 'auto',
		});
	};
	//scroll to bottom when new message is added or active group changes
	//stores user info for each unique user in the active group, keeps track of users that have already been fetched
	const [usersInfoCache, setUsersInfoCache] = useState<{
		[key: string]: User;
	}>({});
	useEffect(() => {
		//fetches user info for each user in the active group that is not on cache
		if (chatInfo.activeGroup) {
			chatInfo.activeGroup.messages.forEach((message) => {
				if (!usersInfoCache[message.senderId]) {
					getUserInfo(message.senderId).then((info) => {
						if (info) {
							setTimeout(() => {
								setUsersInfoCache((prev) => ({
									...prev,
									[message.senderId]: info as User,
								}));
							}, 10000);
						}
					});
				}
			});
		}
	}, [chatInfo.activeGroup]);

	//when cache or active group id changes, scroll to bottom
	useEffect(() => {
		scrollToBottomNoAnim();
	}, [usersInfoCache, chatInfo.activeGroup?.id]);

	//scrolls to bottom smooth when new message is added
	useEffect(() => {
		scrollToBottom();
	}, [chatInfo.activeGroup?.messages]);

	return (
		<div className='bg-gray-900 flex-grow flex flex-col justify-between h-full overflow-x-hidden pl-[10%] md:pl-0'>
			{chatInfo.activeGroup ? (
				<>
					<GroupHeader />
					<div
						ref={messagesBox}
						className='flex-grow overflow-y-auto overflow-x-hidden '
					>
						{chatInfo.activeGroup.messages.map(
							(message: Message, index: number) => (
								<MessageBox
									message={message}
									userInfo={usersInfoCache[message.senderId]}
									key={index}
								/>
							)
						)}
					</div>
					<InputBar />
				</>
			) : (
				<NoGroup />
			)}
		</div>
	);
};
