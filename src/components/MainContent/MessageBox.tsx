import { useMemo, useState, useEffect } from 'react';

import { getUserInfo } from '../../auth/providers';
import { Message as IMessage, User } from '../../types/types';

interface Props {
	message: IMessage;
	userInfo: User | null;
}

export const MessageBox = ({ message, userInfo }: Props) => {
	//formats date into text
	const datetimeStr = useMemo(() => {
		const date = new Date(message.timestamp);
		return (
			date.getDay() +
			'/' +
			date.getMonth() +
			'/' +
			date.getFullYear() +
			' ' +
			date.getHours().toString().padStart(2, '0') +
			':' +
			date.getMinutes().toString().padStart(2, '0')
		);
	}, [message]);

	return (
		<div className='bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 rounded-md  px-4 py-2 my-2 mx-2 sm:m-4 transition-colors overflow-hidden  break-words'>
			{!userInfo && (
				<div className='flex gap-4 w-full grow'>
					<div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 bg-gray-600'></div>
					<div className='grow sm:grow-0'>
						<div className='flex sm:gap-8 items-center mb-2'>
							<div className='font-semibold text-sm sm:text-base grow sm:w-[140px] bg-gray-600 h-4 max-w-[140px] rounded-sm'></div>
							<div className='text-xs bg-gray-600 h-4 w-[60px] ml-auto  rounded-sm'></div>
						</div>
						<div className='text-base bg-gray-600 h-4 w-full rounded-sm'></div>
					</div>
				</div>
			)}
			{userInfo && (
				<>
					<div className='flex gap-4 w-full grow'>
						<div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0'>
							<img
								className='rounded-full w-full aspect-square'
								src={userInfo?.photoURL || '/default-user.png'}
								alt=''
								referrerPolicy='no-referrer'
							/>
						</div>
						<div className='grow sm:grow-0'>
							<div className='flex sm:gap-8 items-center'>
								<div className='font-semibold text-sm sm:text-base grow sm:grow-0'>
									{userInfo?.displayName.split(' ')[0] +
										' ' +
										(userInfo?.displayName.split(' ')[1] ||
											' ') || 'No name!'}
								</div>
								<div className='text-xs ml-auto'>
									{datetimeStr}
								</div>
							</div>
							<div className='text-base'>{message.content}</div>
						</div>
					</div>
					{message.photoURL && (
						<div className='flex justify-center bg-gray-700 border border-gray-600 rounded-md p-2 mt-2 max-h-[400px] '>
							<img
								src={message.photoURL}
								alt=''
								className='object-contain '
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};
