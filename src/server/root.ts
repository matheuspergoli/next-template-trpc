import { postRouter } from "@/server/routers/post"
import { createTRPCRouter } from "@/server/trpc"

export const appRouter = createTRPCRouter({
	post: postRouter
})

export type AppRouter = typeof appRouter
