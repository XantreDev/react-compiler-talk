import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router";
import { ProductsPage } from "./routes/ProductsPage";
import { RootLayout } from "./routes/RootLayout";
import { SettingsPage } from "./routes/SettingsPage";
import { SlowPage2 } from "./routes/SlowPage2";
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

const slowRoute2 = createRoute({
	getParentRoute: () => rootRoute,
	path: "/slow2",
	component: SlowPage2,
});

const settingsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/settings",
	component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
	indexRoute,
	productsRoute,
	tinderProductsRoute,
	settingsRoute,
	slowRoute,
	slowRoute2,
]);

export const router = createRouter({
	routeTree,
});

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
