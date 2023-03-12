import { useMemo, useState, useEffect } from 'react';

import { getUserInfo } from '../../auth/providers';
import { Message as IMessage, User } from '../../types/types';

interface Props {
	message: IMessage;
	onLoadUserInfo?: () => void;
}

export const MessageBox = ({ message, onLoadUserInfo }: Props) => {
	const [isLoading, setIsLoading] = useState(true);
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

	//contains user info from sender
	const [userInfo, setUserInfo] = useState<User | null>(null);

	//fetches user info from sender when props change
	useEffect(() => {
		setIsLoading(true);
		getUserInfo(message.senderId)
			.then((info) => {
				if (info) setUserInfo(info as User);
			})
			.then(() => {
				if (typeof onLoadUserInfo === 'function') {
					onLoadUserInfo();
				}
			})
			.then(() => {
				setIsLoading(false);
			});
	}, [message]);

	return (
		<div className='bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 rounded-md  px-4 py-2 my-2 mx-2 sm:m-4 transition-colors overflow-hidden  break-words'>
			{!isLoading && (
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
			{isLoading && (
				<>
					<div className='animate-pulse flex gap-4 w-full'>
						<div className='w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 bg-gray-600'></div>
						<div className='flex-grow'>
							<div className='flex sm:gap-4 items-center'>
								<div className='font-semibold text-sm sm:text-base flex-grow sm:flex-grow-0 bg-gray-600 h-4 rounded-md w-[200px]'></div>
								<div className='text-xs  bg-gray-600 h-4 w-[100px] rounded-md'></div>
							</div>
							<div className='animate-pulse flex justify-center bg-gray-600 rounded-md p-2 mt-2 h-[10px] '></div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
