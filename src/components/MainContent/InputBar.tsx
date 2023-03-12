import { startNewMessage } from '../../redux/chat/thunks';
import { useAppDispatch, useAppSelector } from './../../redux/hooks';
import { useRef, useState, useEffect } from 'react';
import { RootState } from '../../redux/store';

export const InputBar = () => {
	const dispatch = useAppDispatch();

	//message input state
	const [currInput, setCurrInput] = useState('');

	//logged in user id
	const uid = useAppSelector((state: RootState) => state.auth.user?.uid);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		//if input is empty, do nothing
		if (!currInput) return;

		//send message via redux thunk
		dispatch(
			startNewMessage({
				content: currInput,
				senderId: uid as string,
				timestamp: new Date().getTime(),
				photo: pictureInputFile,
			})
		);
		//clear input
		setCurrInput('');
		//clear picture input
		setPictureInputFile(null);

		//unfocus input
		inputRef.current?.blur();
	};

	const inputRef = useRef<HTMLTextAreaElement>(null);

	//resize textarea on input
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.style.height = 'auto';
			inputRef.current.style.height =
				inputRef.current.scrollHeight + 'px';
		}
	}, [currInput]);

	//=======================FILE UPLOAD=====================//

	//picture upload hidden input ref
	const pictureInputRef = useRef<HTMLInputElement>(null);

	//handle picture upload
	const onUploadPictureClick = () => {
		pictureInputRef.current?.click();
	};

	const [pictureInputFile, setPictureInputFile] = useState<File | null>(null);

	return (
		<div className='bg-gray border-y border-r border-r-gray-600  border-y-gray-600 px-4 py-4 sm:px-8 sm:py-8'>
			<form onSubmit={onSubmit} className='flex gap-2 items-start'>
				<textarea
					ref={inputRef}
					className='w-full bg-gray-800 rounded-md border border-gray-600 px-3 py-1 sm:px-4 sm:py-2 outline-none text-sm sm:text-base text-white overflow-hidden resize-none'
					placeholder='Type a message'
					value={currInput}
					onChange={(e) => setCurrInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && e.shiftKey) {
							//if shift is pressed, manually submit form
							interface FormSubmittable extends EventTarget {
								form: HTMLFormElement;
							}

							const target = e.target as FormSubmittable;

							target.form.dispatchEvent(
								new Event('submit', {
									cancelable: true,
									bubbles: true,
								})
							);
						}
					}}
				/>
				<div className='flex gap-2'>
					<button className='bg-gray-800 px-1 py-1 rounded-md border border-gray-600 sm:p-2'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-6 w-6 text-gray-400 hover:text-gray-500 transition-colors duration-75'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 19l9 2-9-18-9 18 9-2zm0 0v-8'
							/>
						</svg>
					</button>
					<button
						className='bg-gray-800 p-1 sm:p-2 rounded-md border border-gray-600'
						onClick={onUploadPictureClick}
					>
						<svg
							className={`h-6 w-6 text-gray-400 hover:text-gray-500 transition-colors duration-75 ${
								pictureInputFile && 'animate-bounce'
							}`}
							xmlns='http://www.w3.org/2000/svg'
							height='24'
							width='24'
							fill='currentColor'
							viewBox='0 0 48 48'
						>
							<path d='M24 34.65q3.6 0 6.05-2.45 2.45-2.45 2.45-6.05 0-3.65-2.45-6.05T24 17.7q-3.65 0-6.075 2.425Q15.5 22.55 15.5 26.15q0 3.6 2.425 6.05Q20.35 34.65 24 34.65Zm-16.5 8.4q-1.85 0-3.2-1.325T2.95 38.5V13.75q0-1.85 1.35-3.225T7.5 9.15h6.65L18.3 4.3h11.5l4.1 4.85h6.6q1.85 0 3.225 1.375T45.1 13.75V38.5q0 1.9-1.375 3.225Q42.35 43.05 40.5 43.05Z' />
						</svg>
					</button>
				</div>
				<input
					onChange={(e) => {
						setPictureInputFile(e.target.files?.[0] ?? null);
					}}
					type='file'
					name=''
					id=''
					className='hidden'
					ref={pictureInputRef}
				/>
			</form>
		</div>
	);
};
