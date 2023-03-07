import { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { startLogout, startSignInWithGoogle } from '../../redux/auth/thunks';
import { ProfilePopup } from './ProfilePopup';

const buttonClasses =
	'bg-blue-500 px-4 py-1 rounded text-base ml-2 font-bold hover:bg-blue-600 transition-colors duration-75';

export const MainHeader = () => {
	//auth state and dispatch
	const authState = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();

	//state to show/hide profile popup
	const [showProfilePopup, setShowProfilePopup] = useState<boolean>(false);

	//hide profile popup when user logs out
	useEffect(() => {
		if (authState.status !== 'loggedIn') {
			setShowProfilePopup(false);
		}
	}, [authState.status]);

	return (
		<div className='bg-gray-900 h-16 sm:h-20 border-b border-b-gray-600'>
			<div className='flex items-center container mx-auto text-white h-full'>
				<div className='font-bold text-xl sm:text-2xl font-shantel-sans'>
					Messenger++
				</div>
				<div className='flex items-center ml-auto'>
					<div className='mr-2 group relative'>
						{authState.status === 'loggedIn' && (
							<img
								className='rounded-full w-10 h-10 
								sm:w-14 sm:h-14 cursor-pointer'
								src={authState.user?.photoURL}
								alt=''
								onClick={() => {
									setShowProfilePopup(!showProfilePopup);
								}}
								referrerPolicy='no-referrer'
							/>
						)}
						{showProfilePopup && <ProfilePopup />}
					</div>
				</div>

				{authState.status === 'loggedIn' ? null : (
					<button
						className={buttonClasses + ' ml-auto'}
						onClick={() => {
							dispatch(startSignInWithGoogle());
						}}
					>
						Log in
					</button>
				)}
			</div>
		</div>
	);
};
