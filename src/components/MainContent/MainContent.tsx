import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { NoGroup } from './NoGroup';
import { InputBar } from './InputBar';
import { GroupHeader } from './GroupHeader';
import { Message } from './../../types/types';
import { MessageBox } from './MessageBox';

export const MainContent = () => {
	const chatInfo = useAppSelector((state: RootState) => state.chat);

	if (!chatInfo.activeGroup) {
		return <NoGroup />;
	}

	return (
		<div className='bg-zinc-200  flex-grow flex flex-col justify-between h-full overflow-x-hidden '>
			<GroupHeader />
			<div className='flex-grow overflow-y-auto overflow-x-hidden'>
				{chatInfo.activeGroup.messages.map(
					(message: Message, index: number) => (
						<MessageBox message={message} key={index} />
					)
				)}
			</div>
			<InputBar />
		</div>
	);
};
