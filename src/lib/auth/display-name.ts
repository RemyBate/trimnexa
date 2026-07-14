interface UserNameFields {
	firstName?: string | null;
	name?: string | null;
	email: string;
}

/**
 * Resolves a friendly first name for greetings and header display.
 */
export function getUserFirstName(user: UserNameFields): string {
	const firstName = user.firstName?.trim();
	if (firstName) {
		return firstName;
	}

	const fullName = user.name?.trim();
	if (fullName) {
		const [part] = fullName.split(/\s+/);
		if (part) {
			return part;
		}
	}

	const [localPart] = user.email.split('@');
	return localPart || user.email;
}

export function formatWelcomeMessage(template: string, name: string): string {
	return template.replace('{name}', name);
}
