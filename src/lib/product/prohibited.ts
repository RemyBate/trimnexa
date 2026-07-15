const PROHIBITED_KEYWORDS = [
	'weapon',
	'firearm',
	'ammunition',
	'explosive',
	'counterfeit',
	'fake passport',
	'stolen',
	'illegal drug',
	'narcotic',
	'cannabis',
	'cocaine',
	'human organ',
];

export function findProhibitedTerms(text: string): string[] {
	const normalized = text.toLowerCase();
	const matches = new Set<string>();

	for (const keyword of PROHIBITED_KEYWORDS) {
		if (normalized.includes(keyword)) {
			matches.add(keyword);
		}
	}

	return [...matches];
}

export function assertProductContentAllowed(title: string, description?: string | null): void {
	const combined = `${title}\n${description ?? ''}`;
	const matches = findProhibitedTerms(combined);

	if (matches.length > 0) {
		throw new Error('prohibited_content');
	}
}
