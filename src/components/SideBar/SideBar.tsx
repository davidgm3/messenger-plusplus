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

	const handlers = useSwipeable({
		onSwipedLeft: () => setIsOpen(false),
		onSwipedRight: () => setIsOpen(true),
		trackMouse: true,
	});
	const [isOpen, setIsOpen] = useState(false);
	return (
		<div
			{...handlers}
			className={`bg-zinc-200 border-r-2 p-2 border-zinc-400  basis-[350px] flex flex-col gap-2 text-white overflow-y-auto h-full shrink-0 grow-0 fixed sm:static ${
				isOpen ? 'translate-x-0 w-full' : '-translate-x-[90%] w-full'
			} transition-all duration-300 ease-in-out
			sm:!translate-x-0
				`}
		>
			{groups.map((group: Group) => (
				<GroupBox group={group} key={group.id} />
			))}
			<JoinGroupBox />
			<CreateNewGroupBox />
		</div>
	);
};
