import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { NoGroup } from './NoGroup';
import { InputBar } from './InputBar';
import { GroupHeader } from './GroupHeader';
import { Message } from './../../types/types';
import { MessageBox } from './MessageBox';

export const MainContent = () => {
	const chatInfo = useAppSelector((state: RootState) => state.chat);

	return (
		<div className='bg-zinc-200  flex-grow flex flex-col justify-between h-full overflow-x-hidden pl-[10%] sm:pl-0'>
			{chatInfo.activeGroup ? (
				<>
					<GroupHeader />
					<div className='flex-grow overflow-y-auto overflow-x-hidden '>
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
