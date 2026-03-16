import type { ProductsResponse } from "../types/products";

const PRODUCTS_ENDPOINT = "https://dummyjson.com/products";

type FetchProductsPageParams = {
	limit: number;
	skip: number;
	signal?: AbortSignal;
};

export type DeleteProductParams = {
	id: number;
	signal?: AbortSignal;
};

export type DeleteProductResponse = {
	id: number;
	isDeleted: boolean;
	deletedOn?: string;
};

export async function fetchProductsPage({
	limit,
	skip,
	signal,
}: FetchProductsPageParams): Promise<ProductsResponse> {
	const search = new URLSearchParams({
		limit: String(limit),
		skip: String(skip),
	});

	const response = await fetch(`${PRODUCTS_ENDPOINT}?${search.toString()}`, {
		signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch products (${response.status})`);
	}

	return (await response.json()) as ProductsResponse;
}

export async function deleteProduct({
	id,
	signal,
}: DeleteProductParams): Promise<DeleteProductResponse> {
	const response = await fetch(`${PRODUCTS_ENDPOINT}/${id}`, {
		method: "DELETE",
		signal,
	});

	if (!response.ok) {
		throw new Error(`Failed to delete product (${response.status})`);
	}

	return (await response.json()) as DeleteProductResponse;
}
