import { z } from 'zod';

export const cartAddItemSchema = z.object({
	productId: z.string().trim().min(1).max(64),
	quantity: z.coerce.number().int().min(1).max(99).default(1),
});

export type CartAddItemInput = z.infer<typeof cartAddItemSchema>;

export const cartUpdateQuantitySchema = z.object({
	quantity: z.coerce.number().int().min(0).max(99),
});

export type CartUpdateQuantityInput = z.infer<typeof cartUpdateQuantitySchema>;

export const wishlistAddItemSchema = z.object({
	productId: z.string().trim().min(1).max(64),
});

export type WishlistAddItemInput = z.infer<typeof wishlistAddItemSchema>;

export const GUEST_CART_COOKIE = 'trimnexa_guest_cart';
export const GUEST_CART_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
export const MAX_CART_LINES = 50;
