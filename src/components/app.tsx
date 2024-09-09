import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Paper } from '@mantine/core';
import NavigationButtons from './navbar';
import MainPage from './mainpage';
import LoginPage from './auth';
import RegisterPage from './register';

const App = () => {
	return (
		<Paper
			p='md'
			style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
		>
			<Router>
				<Paper
					p='md'
					shadow='xl'
					style={{ marginBottom: '20px', position: 'relative' }}
				>
					<NavigationButtons />
				</Paper>
				<Container>
					<Routes>
						<Route path='/' element={<MainPage />} />
						<Route path='/auth' element={<LoginPage />} />
						<Route path='/register' element={<RegisterPage />} />
					</Routes>
				</Container>
			</Router>
		</Paper>
	);
};

export default App;
