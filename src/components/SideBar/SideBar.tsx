import React, { useEffect, useState } from 'react';
import { createNewGroup, getGroupInfo, joinGroup } from '../../chat/providers';

import { useAppSelector } from '../../redux/hooks';
import { useAppDispatch } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { Group } from '../../types/types';
import { loadGroups } from '../../redux/chat/thunks';
import { GroupBox } from './GroupBox';
import { JoinGroupBox } from './JoinGroupBox';
import { CreateNewGroupBox } from './CreateNewGroupBox';

export const SideBar = () => {
	const groups: Group[] = useAppSelector(
		(state: RootState) => state.chat.groups
	);

	return (
		<div className='bg-zinc-200 border-r-2 p-2 border-zinc-400  basis-[350px] flex flex-col gap-2 text-white overflow-y-auto h-full shrink-0'>
			{groups.map((group: Group) => (
				<GroupBox group={group} key={group.id} />
			))}
			<JoinGroupBox />
			<CreateNewGroupBox />
		</div>
	);
};
