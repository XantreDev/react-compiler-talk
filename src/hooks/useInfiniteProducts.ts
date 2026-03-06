import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchProductsPage } from '../api/products'

const PAGE_SIZE = 20

export function useInfiniteProducts() {
  const query = useInfiniteQuery({
    queryKey: ['products', PAGE_SIZE],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      fetchProductsPage({
        limit: PAGE_SIZE,
        skip: pageParam,
        signal,
      }),
    getNextPageParam: (lastPage, allPages) => {
      const loaded = allPages.reduce((count, page) => count + page.products.length, 0)

      if (loaded >= lastPage.total || lastPage.products.length === 0) {
        return undefined
      }

      return loaded
    },
    retry: 1,
  })

  return {
    ...query,
    products: query.data?.pages.flatMap((page) => page.products) ?? [],
  }
}
