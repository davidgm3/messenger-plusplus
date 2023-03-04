import React from 'react';
import { MainHeader } from './MainHeader/MainHeader';
import { SideBar } from './SideBar/SideBar';
import { MainContent } from './MainContent/MainContent';

export const Layout = () => {
	return (
		<div className='h-full w-full overflow-hidden flex flex-col'>
			<MainHeader />
			<div className='flex flex-grow overflow-y-auto overflow-x-hidden'>
				<SideBar />
				<MainContent />
			</div>
		</div>
	);
};
