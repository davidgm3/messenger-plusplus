import './main.css';
import { useCheckAuthState } from './auth/hooks/useCheckAuthState';
import { Layout } from './components/Layout';

export const App = () => {
	useCheckAuthState();

	return <Layout />;
};
