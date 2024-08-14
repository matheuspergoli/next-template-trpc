import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"

import { getSession } from "@/libs/auth"
import { prisma } from "@/libs/prisma"

export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await getSession()

	return {
		prisma,
		session,
		...opts
	}
}

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
			}
		}
	}
})

export const createTRPCRouter = t.router

export const createCallerFactory = t.createCallerFactory

const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now()

	if (t._config.isDev) {
		const waitMs = Math.floor(Math.random() * 400) + 100
		await new Promise((resolve) => setTimeout(resolve, waitMs))
	}

	const result = await next()

	const end = Date.now()
	console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

	return result
})

export const publicProcedure = t.procedure.use(timingMiddleware)

export const protectedProcedure = t.procedure
	.use(timingMiddleware)
	.use(({ ctx, next }) => {
		if (!ctx.session || !ctx.session.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}
		return next({
			ctx: {
				session: { ...ctx.session, user: ctx.session.user }
			}
		})
	})
