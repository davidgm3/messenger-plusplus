import { useMemo, useState, useEffect } from 'react';

import { getUserInfo } from '../../auth/providers';
import { Message as IMessage, User } from '../../types/types';

interface Props {
	message: IMessage;
	onLoadUserInfo?: () => void;
}

export const MessageBox = ({ message, onLoadUserInfo }: Props) => {
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
		getUserInfo(message.senderId)
			.then((info) => {
				if (info) setUserInfo(info as User);
			})
			.then(() => {
				if (typeof onLoadUserInfo === 'function') {
					onLoadUserInfo();
				}
			});
	}, [message]);

	return (
		<div className='bg-white hover:bg-blue-200 border-2 border-zinc-400 rounded-md  px-4 py-2 my-2 mx-4 transition-colors overflow-hidden  break-words'>
			<div className='flex gap-4'>
				<div className='w-10 h-10 rounded-full flex-shrink-0'>
					<img
						className='rounded-full w-full aspect-square'
						src={userInfo?.photoURL || '/default-user.png'}
						alt=''
						referrerPolicy='no-referrer'
					/>
				</div>
				<div>
					<div className='flex gap-3'>
						<div className='font-semibold  text-sm'>
							{userInfo?.displayName}
						</div>
						<div className='text-xs ml-auto'>{datetimeStr}</div>
					</div>
					<div className='text-base'>{message.content}</div>
				</div>
			</div>
		</div>
	);
};
