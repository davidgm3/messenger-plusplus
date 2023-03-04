import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadGroups } from '../redux/chat/thunks';
import { useAppDispatch } from '../redux/hooks';

//loads group on start
export const useLoadGroups = () => {
	const dispatch = useAppDispatch();
	useEffect(() => {
		dispatch(loadGroups());
	}, []);
};
