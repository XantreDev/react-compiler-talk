import { useEffect, useRef } from "react";
import { useMutationState } from "@tanstack/react-query";
import {
	useDeleteProduct,
	useInfiniteProducts,
} from "../hooks/useInfiniteProducts";

export function ProductsPage() {
	const sentinelRef = useRef<HTMLDivElement | null>(null);
	const {
		products,
		error,
		isError,
		isPending,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
	} = useInfiniteProducts();

	const deleteProductMutation = useDeleteProduct();
	const deletingProductIds = useMutationState<number | undefined>({
		filters: { mutationKey: ["delete-product"], status: "pending" },
		select: (mutation) =>
			(mutation.state.variables as { id: number } | undefined)?.id,
	}).filter((id): id is number => typeof id === "number");

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) {
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const isVisible = entries.some((entry) => entry.isIntersecting);
				if (isVisible && hasNextPage && !isFetchingNextPage) {
					void fetchNextPage();
				}
			},
			{
				root: null,
				rootMargin: "300px 0px",
				threshold: 0,
			},
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	return (
		<section>
			<header className="mb-8">
				<h1 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
					Products
				</h1>
				<p className="mt-2 text-sm text-slate-300">
					Infinite scrolling with DummyJSON + TanStack Query
				</p>
			</header>

			{deleteProductMutation.isError ? (
				<section className="mb-6 rounded-lg border border-red-500/50 bg-red-950/40 p-4 text-red-100">
					<p className="text-sm">
						{deleteProductMutation.error instanceof Error
							? deleteProductMutation.error.message
							: "Failed to delete product"}
					</p>
					<button
						type="button"
						onClick={() => deleteProductMutation.reset()}
						className="mt-3 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-400"
					>
						Dismiss
					</button>
				</section>
			) : null}

			{isPending && products.length === 0 ? (
				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 6 }).map((_, index) => (
						<div
							key={index}
							className="h-72 animate-pulse rounded-xl border border-slate-700 bg-slate-800/60"
						/>
					))}
				</section>
			) : null}

			{products.length > 0 ? (
				<section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{products.map((product) =>
						(() => {
							const isDeleting = deletingProductIds.includes(product.id);

							return (
								<article
									key={product.id}
									className="overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 shadow-sm"
								>
									<img
										src={product.thumbnail}
										alt={product.title}
										className="h-40 w-full object-cover"
										loading="lazy"
									/>
									<div className="space-y-2 p-4">
										<p className="text-xs uppercase tracking-wide text-slate-400">
											{product.category}
										</p>
										<h2 className="line-clamp-1 text-lg font-medium text-slate-100">
											{product.title}
										</h2>
										<p className="line-clamp-2 text-sm text-slate-300">
											{product.description}
										</p>
										<div className="flex items-center justify-between gap-3 pt-1">
											<p className="text-base font-semibold text-emerald-300">
												${product.price}
											</p>
											<button
												type="button"
												onClick={() =>
													deleteProductMutation.mutate({ id: product.id })
												}
												disabled={isDeleting}
												className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-70"
											>
												{isDeleting ? "Deleting..." : "Delete"}
											</button>
										</div>
									</div>
								</article>
							);
						})(),
					)}
				</section>
			) : null}

			{isError ? (
				<section className="mt-6 rounded-lg border border-red-500/50 bg-red-950/40 p-4 text-red-100">
					<p className="text-sm">
						{error instanceof Error ? error.message : "Failed to load products"}
					</p>
					<button
						type="button"
						onClick={() => void refetch()}
						className="mt-3 rounded-md bg-red-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-400"
					>
						Retry
					</button>
				</section>
			) : null}

			{isFetchingNextPage ? (
				<p className="mt-6 text-center text-sm text-slate-300">
					Loading more products...
				</p>
			) : null}

			{!hasNextPage && products.length > 0 ? (
				<p className="mt-6 text-center text-sm text-slate-400">
					You&apos;ve reached the end.
				</p>
			) : null}

			{!isPending && !isError && products.length === 0 ? (
				<p className="text-center text-sm text-slate-300">
					No products were returned.
				</p>
			) : null}

			<div ref={sentinelRef} className="h-10 w-full" aria-hidden="true" />
		</section>
	);
}
