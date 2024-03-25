import { postRouter } from "@/server/routers/post"
import { createCallerFactory, createTRPCRouter } from "@/server/trpc"

export const appRouter = createTRPCRouter({
	post: postRouter
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
