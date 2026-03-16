import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import { deleteProduct, fetchProductsPage } from "../api/products";
import type { ProductsResponse } from "../types/products";

const PAGE_SIZE = 20;
const PRODUCTS_QUERY_KEY = ["products", PAGE_SIZE] as const;

export function useInfiniteProducts() {
	const query = useInfiniteQuery({
		queryKey: PRODUCTS_QUERY_KEY,
		initialPageParam: 0,
		queryFn: ({ pageParam, signal }) =>
			fetchProductsPage({
				limit: PAGE_SIZE,
				skip: pageParam,
				signal,
			}),
		getNextPageParam: (lastPage, allPages) => {
			const loaded = allPages.reduce(
				(count, page) => count + page.products.length,
				0,
			);

			if (loaded >= lastPage.total || lastPage.products.length === 0) {
				return undefined;
			}

			return loaded;
		},
		retry: 1,
	});

	return {
		...query,
		products: query.data?.pages.flatMap((page) => page.products) ?? [],
	};
}

type DeleteProductContext = {
	previousProducts?: InfiniteData<ProductsResponse, number>;
};

export const useDeleteProduct = () => {
	const queryClient = useQueryClient();

	const deleteProductMutation = useMutation<
		unknown,
		Error,
		{ id: number },
		DeleteProductContext
	>({
		mutationKey: ["delete-product"],
		mutationFn: ({ id }) => deleteProduct({ id }),
		onMutate: async ({ id }) => {
			await queryClient.cancelQueries({ queryKey: PRODUCTS_QUERY_KEY });

			const previousProducts =
				queryClient.getQueryData<InfiniteData<ProductsResponse, number>>(
					PRODUCTS_QUERY_KEY,
				);

			queryClient.setQueryData<InfiniteData<ProductsResponse, number>>(
				PRODUCTS_QUERY_KEY,
				(oldData) => {
					if (!oldData) {
						return oldData;
					}

					let removed = false;
					const nextPages = oldData.pages.map((page) => {
						const nextProducts = page.products.filter((product) => {
							const keep = product.id !== id;
							if (!keep) {
								removed = true;
							}
							return keep;
						});

						if (nextProducts.length === page.products.length) {
							return page;
						}

						return {
							...page,
							products: nextProducts,
							total: Math.max(0, page.total - 1),
						};
					});

					if (!removed) {
						return oldData;
					}

					return {
						...oldData,
						pages: nextPages,
					};
				},
			);

			return { previousProducts };
		},
		onError: (_error, _variables, context) => {
			if (context?.previousProducts) {
				queryClient.setQueryData(PRODUCTS_QUERY_KEY, context.previousProducts);
			}
		},
		onSettled: async () => {
			await queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
		},
	});

	return deleteProductMutation;
};
