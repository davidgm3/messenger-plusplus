import { useAppSelector } from '../../redux/hooks';

import { RootState } from '../../redux/store';
import { Group } from '../../types/types';

import { GroupBox } from './GroupBox';
import { JoinGroupBox } from './JoinGroupBox';
import { CreateNewGroupBox } from './CreateNewGroupBox';
import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';

export const SideBar = () => {
	const groups: Group[] = useAppSelector(
		(state: RootState) => state.chat.groups
	);

	//useSwipeable hook
	const handlers = useSwipeable({
		onSwipedLeft: () => {
			//we use a timeout to  force the close to be after handling click event
			//hacky way of doing it but it works
			setTimeout(() => {
				setIsOpen(false);
			}, 5);
		},
		trackMouse: true,
		trackTouch: true,
		delta: 20,
		preventScrollOnSwipe: true,
	});

	const [isOpen, setIsOpen] = useState(false);
	return (
		<div
			onClick={(e) => {
				if (!isOpen) setIsOpen(true);
			}}
			{...handlers}
			className={`select-none bg-zinc-200 border-r-2 p-2 border-zinc-400  basis-[350px] flex flex-col gap-2 text-white overflow-y-auto h-full shrink-0 grow-0 fixed sm:static ${
				isOpen ? 'translate-x-0 w-full' : '-translate-x-[90%] w-full'
			} transition-all duration-300 ease-in-out
			sm:!translate-x-0
				`}
		>
			{groups.map((group: Group) => (
				<GroupBox
					group={group}
					key={group.id}
					onClick={(e) => setIsOpen(false)}
				/>
			))}
			<JoinGroupBox />
			<CreateNewGroupBox />
		</div>
	);
};
