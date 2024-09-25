// PasswordUtils.tsx

import { IconCheck, IconX } from '@tabler/icons-react';
import { Text, Box, rem } from '@mantine/core';

export function PasswordRequirement({
	meets,
	label,
}: {
	meets: boolean;
	label: string;
}) {
	return (
		<Text
			c={meets ? 'teal' : 'red'}
			style={{ display: 'flex', alignItems: 'center' }}
			mt={7}
			size='sm'
		>
			{meets ? (
				<IconCheck style={{ width: rem(14), height: rem(14) }} />
			) : (
				<IconX style={{ width: rem(14), height: rem(14) }} />
			)}{' '}
			<Box ml={10}>{label}</Box>
		</Text>
	);
}

export const requirements = [
	{ re: /[0-9]/, label: 'Содержит число' },
	{ re: /[a-z]/, label: 'Содержит строчную букву' },
	{ re: /[A-Z]/, label: 'Содержит заглавную букву' },
	{ re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Содержит специальный символ' },
];

export function getStrength(password: string) {
	let multiplier = password.length > 5 ? 0 : 1;

	requirements.forEach(requirement => {
		if (!requirement.re.test(password)) {
			multiplier += 1;
		}
	});

	return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}
