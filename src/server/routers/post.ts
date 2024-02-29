import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "@/server/trpc"

export const postRouter = createTRPCRouter({
	getAll: publicProcedure.query(async ({ ctx }) => {
		return ctx.prisma.post.findMany()
	}),

	create: publicProcedure
		.input(
			z.object({
				name: z.string().min(1, "Post name must be at least 1 character long")
			})
		)
		.mutation(async ({ ctx, input }) => {
			await new Promise((resolve) => setTimeout(resolve, 1000))

			return ctx.prisma.post.create({
				data: {
					name: input.name
				}
			})
		}),

	delete: publicProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			await ctx.prisma.post.delete({
				where: {
					id: input.id
				}
			})

			return { message: "Post deleted" }
		})
})
