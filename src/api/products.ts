import type { ProductsResponse } from '../types/products'

const PRODUCTS_ENDPOINT = 'https://dummyjson.com/products'

type FetchProductsPageParams = {
  limit: number
  skip: number
  signal?: AbortSignal
}

export async function fetchProductsPage({
  limit,
  skip,
  signal,
}: FetchProductsPageParams): Promise<ProductsResponse> {
  const search = new URLSearchParams({
    limit: String(limit),
    skip: String(skip),
  })

  const response = await fetch(`${PRODUCTS_ENDPOINT}?${search.toString()}`, {
    signal,
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`)
  }

  return (await response.json()) as ProductsResponse
}
