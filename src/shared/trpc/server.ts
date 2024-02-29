import "server-only"

import { cache } from "react"
import { headers } from "next/headers"

import { createTRPCProxyClient, loggerLink, TRPCClientError } from "@trpc/client"
import { callProcedure } from "@trpc/server"
import { observable } from "@trpc/server/observable"
import { type TRPCErrorResponse } from "@trpc/server/rpc"

import { appRouter, type AppRouter } from "@/server/root"
import { createTRPCContext } from "@/server/trpc"

import { transformer } from "./utils"

const createContext = cache(() => {
	const heads = new Headers(headers())
	heads.set("x-trpc-source", "rsc")

	return createTRPCContext({
		headers: heads
	})
})

export const api = createTRPCProxyClient<AppRouter>({
	transformer,
	links: [
		loggerLink({
			enabled: (op) =>
				process.env.NODE_ENV === "development" ||
				(op.direction === "down" && op.result instanceof Error)
		}),
		() =>
			({ op }) =>
				observable((observer) => {
					createContext()
						.then((ctx) => {
							return callProcedure({
								procedures: appRouter._def.procedures,
								path: op.path,
								rawInput: op.input,
								ctx,
								type: op.type
							})
						})
						.then((data) => {
							observer.next({ result: { data } })
							observer.complete()
						})
						.catch((cause: TRPCErrorResponse) => {
							observer.error(TRPCClientError.from(cause))
						})
				})
	]
})
