import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router'
import { ProductsPage } from './routes/ProductsPage'
import { RootLayout } from './routes/RootLayout'
import { SettingsPage } from './routes/SettingsPage'
import { HoistingPage } from './routes/HoistingPage'

const rootRoute = createRootRoute({
  component: RootLayout,
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/products' })
  },
})

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
})

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
})

const hoistingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/hoisting',
  component: HoistingPage
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  productsRoute,
  settingsRoute,
  hoistingRoute
])

export const router = createRouter({
  routeTree,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
