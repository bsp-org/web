import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import {
    Outlet,
    RouterProvider,
    createRootRoute,
    createRoute,
    createRouter,
    redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from './components/Header'
import { NuqsAdapter } from 'nuqs/adapters/tanstack-router'

import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
import 'src/settings.ts'
import 'src/i18n.ts'

import './styles.css'
import reportWebVitals from './reportWebVitals.ts'

import Search from './pages/Search.tsx'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Login from './pages/Login.tsx'

const rootRoute = createRootRoute({
    component: () => (
        <NuqsAdapter>
            <Header />
            <Outlet />
            <TanStackRouterDevtools />
            <ReactQueryDevtools buttonPosition='bottom-right' />
        </NuqsAdapter>
    ),
})

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    loader: () => {
        throw redirect({ to: '/search' })
    },
})

const routeTree = rootRoute.addChildren([
    indexRoute,
    createRoute({
        path: '/search',
        component: Search,
        getParentRoute: () => rootRoute,
    }),
    createRoute({
        path: '/login',
        component: Login,
        getParentRoute: () => rootRoute,
    }),
])

const TanStackQueryProviderContext = TanStackQueryProvider.getContext()
const router = createRouter({
    routeTree,
    context: {
        ...TanStackQueryProviderContext,
    },
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
                <RouterProvider router={router} />
            </TanStackQueryProvider.Provider>
        </StrictMode>,
    )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
