import { createRouter, createRootRoute, createRoute, Outlet, HeadContent } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './routes/index'
import CorePage from './routes/core'

const queryClient = new QueryClient()

const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <Outlet />
    </QueryClientProvider>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
})

const coreRoute = createRoute({
  //TODO: update
  getParentRoute: () => rootRoute,
  path: '/core',
  component: CorePage,
  head: () => ({
    meta: [
      { title: 'core??' },
      { name: 'description', content: 'Core page description' },
      { property: 'og:title', content: 'Core' },
      { property: 'og:description', content: 'Core page description' },
    ],
  }),
})

const routeTree = rootRoute.addChildren([indexRoute, coreRoute])

export const router = createRouter({
  routeTree,
  // New navigations start at the top; back/forward restores the old position.
  // 'instant' so the global `scroll-behavior: smooth` doesn't animate the jump.
  scrollRestoration: true,
  scrollRestorationBehavior: 'instant',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
