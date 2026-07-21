import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 3 * 1024 * 1024;
const MAX_IMAGES_PER_PRODUCT = 8;

export interface SavedProductMedia {
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

export function validateProductMediaFile(file: File): void {
	if (!ALLOWED_MIME_TYPES.has(file.type)) {
		throw new Error('unsupported_media_type');
	}

	if (file.size > MAX_FILE_SIZE_BYTES) {
		throw new Error('file_too_large');
	}
}

export function getMaxImagesPerProduct(): number {
	return MAX_IMAGES_PER_PRODUCT;
}

export async function saveProductMediaFile(
	sellerProfileId: string,
	productId: string,
	file: File,
): Promise<SavedProductMedia> {
	validateProductMediaFile(file);

	const extension = getExtension(file.type);
	const fileName = `${randomUUID()}.${extension}`;
	const relativePath = path.posix.join('uploads', 'products', sellerProfileId, productId, fileName);
	const absoluteDir = path.join(
		process.cwd(),
		'public',
		'uploads',
		'products',
		sellerProfileId,
		productId,
	);
	const absolutePath = path.join(absoluteDir, fileName);

	await mkdir(absoluteDir, { recursive: true });

	const buffer = Buffer.from(await file.arrayBuffer());
	await writeFile(absolutePath, buffer);

	return {
		relativePath,
		publicUrl: `/${relativePath}`,
	};
}
