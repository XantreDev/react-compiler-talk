import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";
import { ProductsPage } from "./routes/ProductsPage";
import { RootLayout } from "./routes/RootLayout";
import { CommunicatePage } from "./routes/CommunicatePage";
import { ReadThoughtsPage } from "./routes/ReadThoughtsPage";
import { SlowPage } from "./routes/SlowPage";
import { TinderProductsPage } from "./routes/TinderProductsPage";

const rootRoute = createRootRoute({
	component: RootLayout,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	beforeLoad: () => {
		throw redirect({ to: "/slow" });
	},
});

const productsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/products",
	component: ProductsPage,
});

const tinderProductsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/tinder-products",
	component: TinderProductsPage,
});

const slowRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/slow",
	component: SlowPage,
});

const readThoughtsPage = createRoute({
	getParentRoute: () => rootRoute,
	path: "/read-thoughts",
	component: ReadThoughtsPage,
});

const communicateRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/communicate",
	component: CommunicatePage,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	productsRoute,
	tinderProductsRoute,
	communicateRoute,
	slowRoute,
	readThoughtsPage,
]);

export const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
