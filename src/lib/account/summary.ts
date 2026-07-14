import { countCustomerOrders } from '@/lib/account/orders';
import { countUnreadNotifications } from '@/lib/account/notifications';
import { countOpenSupportTickets } from '@/lib/account/support';
import { listCustomerAddresses } from '@/lib/account/addresses';
import { countWishlistItems } from '@/lib/account/wishlist';

export interface AccountSummary {
	addressCount: number;
	orderCount: number;
	wishlistCount: number;
	unreadNotifications: number;
	openSupportTickets: number;
}

export async function getAccountSummary(userId: string): Promise<AccountSummary> {
	const [addresses, orderCount, wishlistCount, unreadNotifications, openSupportTickets] =
		await Promise.all([
			listCustomerAddresses(userId),
			countCustomerOrders(userId),
			countWishlistItems(userId),
			countUnreadNotifications(userId),
			countOpenSupportTickets(userId),
		]);

	return {
		addressCount: addresses.length,
		orderCount,
		wishlistCount,
		unreadNotifications,
		openSupportTickets,
	};
}
