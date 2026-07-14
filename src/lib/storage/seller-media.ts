import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

export type SellerMediaKind = 'logo' | 'banner';

export interface SavedSellerMedia {
	relativePath: string;
	publicUrl: string;
}

function getExtension(mimeType: string): string {
	switch (mimeType) {
		case 'image/jpeg':
			return 'jpg';
		case 'image/png':
			return 'png';
		case 'image/webp':
			return 'webp';
		default:
			throw new Error('unsupported_media_type');
	}
}

export function validateSellerMediaFile(file: File): void {
	if (!ALLOWED_MIME_TYPES.has(file.type)) {
		throw new Error('unsupported_media_type');
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		throw new Error('file_too_large');
	}
}

export async function saveSellerMediaFile(
	sellerProfileId: string,
	kind: SellerMediaKind,
	file: File,
): Promise<SavedSellerMedia> {
	validateSellerMediaFile(file);

	const extension = getExtension(file.type);
	const fileName = `${kind}.${extension}`;
	const relativePath = path.posix.join('uploads', 'sellers', sellerProfileId, fileName);
	const absoluteDir = path.join(process.cwd(), 'public', 'uploads', 'sellers', sellerProfileId);
	const absolutePath = path.join(absoluteDir, fileName);

	await mkdir(absoluteDir, { recursive: true });

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(absolutePath, buffer);

	return {
		relativePath,
		publicUrl: `/${relativePath}`,
	};
}
