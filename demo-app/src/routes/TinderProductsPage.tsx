import { useRef, useState } from "react";
import { useSwipeProducts } from "../hooks/useSwipeProducts";

const SWIPE_THRESHOLD = 120;
const SWIPE_OUT_X = 900;
const MAX_VISIBLE_CARDS = 3;

type SwipeDirection = -1 | 1;

export function TinderProductsPage() {
	const { products, isPending, isError, error, refetch } = useSwipeProducts();
	const [currentIndex, setCurrentIndex] = useState(0);
	const [dragX, setDragX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [isAnimatingOut, setIsAnimatingOut] = useState(false);
	const [animateX, setAnimateX] = useState(0);
	const pointerIdRef = useRef<number | null>(null);
	const startXRef = useRef(0);

	const remainingCount = Math.max(products.length - currentIndex, 0);
	const visibleCards = products.slice(
		currentIndex,
		currentIndex + MAX_VISIBLE_CARDS,
	);
	const topCard = visibleCards[0];
	const isExhausted = !isPending && !isError && remainingCount === 0;
	const isLocked = isAnimatingOut || isExhausted;

	const resetInteraction = () => {
		pointerIdRef.current = null;
		startXRef.current = 0;
		setIsDragging(false);
		setIsAnimatingOut(false);
		setAnimateX(0);
		setDragX(0);
	};

	const swipe = (direction: SwipeDirection) => {
		if (isLocked || !topCard) {
			return;
		}

		setIsDragging(false);
		setIsAnimatingOut(true);
		setAnimateX(direction * SWIPE_OUT_X);
	};

	const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
		if (isLocked || !topCard) {
			return;
		}

		pointerIdRef.current = event.pointerId;
		startXRef.current = event.clientX;
		setIsDragging(true);
		setIsAnimatingOut(false);
		setAnimateX(0);
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
		if (!isDragging || pointerIdRef.current !== event.pointerId || isLocked) {
			return;
		}

		setDragX(event.clientX - startXRef.current);
	};

	const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
		if (pointerIdRef.current !== event.pointerId || isLocked) {
			return;
		}

		event.currentTarget.releasePointerCapture(event.pointerId);
		pointerIdRef.current = null;
		setIsDragging(false);

		if (Math.abs(dragX) >= SWIPE_THRESHOLD) {
			const direction: SwipeDirection = dragX > 0 ? 1 : -1;
			setIsAnimatingOut(true);
			setAnimateX(direction * SWIPE_OUT_X);
			return;
		}

		setDragX(0);
	};

	const handlePointerCancel = (event: React.PointerEvent<HTMLDivElement>) => {
		if (pointerIdRef.current !== event.pointerId) {
			return;
		}

		event.currentTarget.releasePointerCapture(event.pointerId);
		resetInteraction();
	};

	const handleTopCardTransitionEnd = () => {
		if (!isAnimatingOut) {
			return;
		}

		setCurrentIndex((prev) => prev + 1);
		setIsAnimatingOut(false);
		setAnimateX(0);
		setDragX(0);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (isLocked || !topCard) {
			return;
		}

		if (event.key === "ArrowLeft") {
			event.preventDefault();
			swipe(-1);
		}

		if (event.key === "ArrowRight") {
			event.preventDefault();
			swipe(1);
		}
	};

	return (
		<section>
			<header className="mb-8">
				<h1 className="text-3xl font-semibold tracking-tight text-slate-100 md:text-4xl">
					Tinder Products
				</h1>
				<p className="mt-2 text-sm text-slate-300">
					Swipe left or right through products fetched from DummyJSON.
				</p>
			</header>

			<div aria-live="polite" className="sr-only">
				{remainingCount} products remaining.
			</div>

			{isPending ? (
				<div className="mx-auto h-[520px] max-w-sm">
					<div className="h-full animate-pulse rounded-3xl border border-slate-700 bg-slate-800/60" />
				</div>
			) : null}

			{isError ? (
				<section className="rounded-lg border border-red-500/50 bg-red-950/40 p-4 text-red-100">
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

			{!isPending && !isError ? (
				<div
					className="mx-auto max-w-sm [touch-action:pan-y]"
					tabIndex={0}
					onKeyDown={handleKeyDown}
				>
					<div className="relative h-[520px]">
						{visibleCards
							.slice()
							.reverse()
								.map((product, reverseIndex) => {
									const index = visibleCards.length - 1 - reverseIndex;
									const isTopCard = index === 0;
									const depth = Math.min(index, 2);
									const dragProgress = Math.min(
										Math.abs(dragX) / SWIPE_THRESHOLD,
										1,
									);

									const x = isTopCard
										? isAnimatingOut
											? animateX
											: dragX
										: 0;
									const rotate = isTopCard ? x / 24 : 0;
									const scale = isTopCard ? 1 : 1 - depth * 0.04;
									const y = depth * 10;
									const opacity = isTopCard
										? isAnimatingOut
											? 0
											: 1 - dragProgress * 0.45
										: 1 - depth * 0.15;

									return (
										<article
										key={product.id}
										onPointerDown={isTopCard ? handlePointerDown : undefined}
										onPointerMove={isTopCard ? handlePointerMove : undefined}
										onPointerUp={isTopCard ? handlePointerUp : undefined}
										onPointerCancel={isTopCard ? handlePointerCancel : undefined}
										onTransitionEnd={
											isTopCard ? handleTopCardTransitionEnd : undefined
										}
											className={`absolute inset-0 overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/80 p-3 shadow-2xl ${
												isTopCard ? "cursor-grab active:cursor-grabbing" : ""
											} ${isTopCard ? "backdrop-blur-md" : ""} ${
												isDragging
													? ""
													: "transition-[transform,opacity] duration-300 ease-out"
											}`}
											style={{
												transform: `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`,
												opacity,
												zIndex: 100 - depth,
											}}
										>
											{product.thumbnail ? (
												<img
													src={product.thumbnail}
													alt={product.title}
													className="h-72 w-full rounded-2xl object-cover"
													draggable={false}
												/>
											) : (
												<div className="h-72 w-full rounded-2xl bg-slate-800" />
											)}
											<div className="space-y-3 px-2 pb-2 pt-4">
											<p className="text-xs uppercase tracking-wide text-slate-400">
												{product.category}
											</p>
											<h2 className="text-2xl font-semibold text-slate-100">
												{product.title}
											</h2>
											<p className="text-sm leading-relaxed text-slate-300">
												{product.description}
											</p>
											<p className="text-xl font-semibold text-emerald-300">
												${product.price}
											</p>
										</div>
									</article>
								);
							})}
					</div>

					{isExhausted ? (
						<section className="mt-6 rounded-lg border border-slate-700 bg-slate-900/70 p-4 text-center">
							<p className="text-sm text-slate-300">No more products to swipe.</p>
							<button
								type="button"
								onClick={() => {
									resetInteraction();
									setCurrentIndex(0);
								}}
								className="mt-3 rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-white"
							>
								Restart deck
							</button>
						</section>
					) : null}

					{!isExhausted ? (
						<p className="mt-4 text-center text-xs text-slate-400">
							Use swipe gestures or keyboard arrows.
						</p>
					) : null}
				</div>
			) : null}
		</section>
	);
}
