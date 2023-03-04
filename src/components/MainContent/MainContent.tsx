import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { NoGroup } from './NoGroup';
import { InputBar } from './InputBar';
import { GroupHeader } from './GroupHeader';
import { Message } from './../../types/types';
import { MessageBox } from './MessageBox';
import { useRef, useEffect } from 'react';

export const MainContent = () => {
	const chatInfo = useAppSelector((state: RootState) => state.chat);

	//holds messages box ref
	const messagesBox = useRef<HTMLDivElement>(null);

	//scrolls to bottom of messages box
	const scrollToBottom = () => {
		console.log('scrolling to bottom');
		messagesBox.current?.scrollTo({
			top: 9007199254740991,
			behavior: 'smooth',
		});
	};

	const scrollToBottomNoAnim = () => {
		console.log('scrolling to bottom no anim');
		messagesBox.current?.scrollTo({
			top: 9007199254740991,
			behavior: 'auto',
		});
	};
	//scroll to bottom when new message is added or active group changes
	useEffect(() => {
		setTimeout(() => {
			scrollToBottomNoAnim();
		}, 300);
	}, [chatInfo.activeGroup]);

	useEffect(() => {
		scrollToBottom();
	}, [chatInfo.activeGroup?.messages]);

	return (
		<div className='bg-zinc-200  flex-grow flex flex-col justify-between h-full overflow-x-hidden pl-[10%] md:pl-0'>
			{chatInfo.activeGroup ? (
				<>
					<GroupHeader />
					<div
						ref={messagesBox}
						className='flex-grow overflow-y-auto overflow-x-hidden '
					>
						{chatInfo.activeGroup.messages.map(
							(message: Message, index: number) => (
								<MessageBox message={message} key={index} />
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
