import { useAppSelector } from '../../redux/hooks';
import { RootState } from '../../redux/store';
import { useAppDispatch } from '../../redux/hooks';
import { startLogout } from '../../redux/auth/thunks';

export const ProfilePopup = () => {
	const authState = useAppSelector((state: RootState) => state.auth);
	const dispatch = useAppDispatch();

	return (
		<div className=' overflow-hidden absolute bg-blue-900 right-0 w-max flex-col px-2 shadow-xl border-2 border-zinc-400 rounded-md py-2 justify-start top-[120%] animate-fadeIn duration-75 z-[10000]'>
			<div>
				{authState.status === 'loggedIn' ? (
					<>
						<span className='block'>Welcome, </span>
						<span className='font-semibold'>
							{authState.user?.displayName}
						</span>
					</>
				) : (
					''
				)}
			</div>
			<hr className='h-0 bg-zinc-400 border-zinc-400 my-3' />

			<button
				className='bg-blue-500 px-4 py-1 rounded text-base  font-bold hover:bg-blue-600 transition-colors duration-75'
				onClick={() => dispatch(startLogout())}
			>
				Log out
			</button>
		</div>
	);
};
