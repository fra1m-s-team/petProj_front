import { useContext, useState } from 'react';
import { Context } from '../main';
import { Button, Drawer, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import ConstructorPage from './consturctor';

const NavigationButtons = () => {
	const navigate = useNavigate();
	let { store } = useContext(Context);
	const [opened, { toggle, close }] = useDisclosure(false);
	const [currentView, setCurrentView] = useState('');

	return (
		<>
			<Burger opened={opened} onClick={toggle} size='sm' />
			<Drawer
				opened={opened}
				onClose={close}
				padding='md'
				// size='15%'
				position='top'
				title='Menu'
				withCloseButton={false}
			>
				<Group>
					<Button
						onClick={() => {
							navigate('/');
							close();
						}}
					>
						Main
					</Button>{' '}
					<Button
						onClick={() => {
							navigate('/game');
							close();
						}}
					>
						Game
					</Button>{' '}
				</Group>

				{currentView === 'game' && <ConstructorPage />}
			</Drawer>
		</>
	);
};

export default NavigationButtons;
