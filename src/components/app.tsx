import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Container, Group, Paper } from '@mantine/core';
import NavigationButtons from './navbar';
import MainPage from './mainpage';
import AvatarButtons from './avatar';
import ConstructorPage from './game';
import UserPage from './user';
import { createScene } from '../services/scene/scene'; // Импортируйте функцию createScene

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
					<Group>
						<AvatarButtons />
						<NavigationButtons />
					</Group>
				</Paper>
				<Container>
					<Routes>
						<Route path='/' element={<MainPage />} />
						<Route path='/game' element={<ConstructorPage />} />
						<Route path='/profile' element={<UserPage />} />
					</Routes>
				</Container>
			</Router>
		</Paper>
	);
};

export default App;
