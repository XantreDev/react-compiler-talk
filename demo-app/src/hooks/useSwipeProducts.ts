import { useQuery } from "@tanstack/react-query";
import { fetchProductsPage } from "../api/products";

const SWIPE_PAGE_SIZE = 20;

export function useSwipeProducts() {
	const query = useQuery({
		queryKey: ["swipe-products", SWIPE_PAGE_SIZE] as const,
		queryFn: ({ signal }) =>
			fetchProductsPage({
				limit: SWIPE_PAGE_SIZE,
				skip: 0,
				signal,
			}),
		retry: 1,
	});

	return {
		...query,
		products: query.data?.products ?? [],
	};
}
