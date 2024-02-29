"use client"

import { useState } from "react"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink, loggerLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"

import { type AppRouter } from "@/server/root"

import { getUrl, transformer } from "./utils"

const createQueryClient = () => new QueryClient()

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
	if (typeof window === "undefined") {
		return createQueryClient()
	}
	return (clientQueryClientSingleton ??= createQueryClient())
}

export const api = createTRPCReact<AppRouter>()

export function TRPCReactProvider(props: { children: React.ReactNode }) {
	const queryClient = getQueryClient()

	const [trpcClient] = useState(() =>
		api.createClient({
			transformer,
			links: [
				loggerLink({
					enabled: (op) =>
						process.env.NODE_ENV === "development" ||
						(op.direction === "down" && op.result instanceof Error)
				}),
				httpBatchLink({
					url: getUrl()
				})
			]
		})
	)

	return (
		<QueryClientProvider client={queryClient}>
			<api.Provider client={trpcClient} queryClient={queryClient}>
				{props.children}
			</api.Provider>
		</QueryClientProvider>
	)
}
