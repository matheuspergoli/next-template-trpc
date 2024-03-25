"use client"

import React from "react"

import { toast } from "sonner"

import { BlurImage } from "@/shared/components/blur-image"
import { api } from "@/shared/trpc/client"
import { Badge } from "@/shared/ui/badge"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"

export default function Page() {
	const [name, setName] = React.useState("")

	const utils = api.useUtils()
	const { data } = api.post.getAll.useQuery()
	const { mutate: createPost, isPending: isLoadingCreate } = api.post.create.useMutation({
		onSuccess() {
			utils.post.getAll.invalidate()
		},
		onError(error) {
			const message = error.data?.zodError?.fieldErrors.name?.[0]
			toast(message)
		}
	})
	const { mutate: deletePost, isPending: isLoadingDelete } = api.post.delete.useMutation({
		onSuccess() {
			utils.post.getAll.invalidate()
		}
	})

	return (
		<main className="container mx-auto mt-20 flex flex-col items-center justify-center gap-10">
			<Badge className="text-sm">Next.js 14 App Router ⚡ tRPC</Badge>
			<section className="space-y-2 text-center">
				<h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
					Next.js 14 Template
				</h1>
				<p className="text-gray-500 md:text-xl">
					Created by{" "}
					<a
						href="https://github.com/matheuspergoli"
						target="_blank"
						rel="noopener noreferrer"
						className="underline">
						Matheus Pergoli
					</a>{" "}
					for personal use. Feel free to use it
				</p>
			</section>

			<form
				className="flex flex-col gap-3"
				onSubmit={(e) => {
					e.preventDefault()
					createPost({ name })
				}}>
				<p className="text-center">👇 Create a post with tRPC 👇</p>
				<Input
					type="text"
					placeholder="Type a name for the post"
					value={name}
					disabled={isLoadingCreate || isLoadingDelete}
					onChange={(e) => setName(e.target.value)}
					className="w-full max-w-60"
				/>
				{data?.map((post) => (
					<div key={post.id} className="flex items-center justify-between gap-3">
						<p>{post.name}</p>
						<Button
							type="button"
							onClick={() => deletePost({ id: post.id })}
							disabled={isLoadingCreate || isLoadingDelete}>
							Delete
						</Button>
					</div>
				))}
				<Button disabled={isLoadingCreate || isLoadingDelete}>Create</Button>
			</form>

			<figure className="overflow-hidden rounded-lg border">
				<BlurImage
					width={400}
					height={400}
					alt="Blurhash"
					src={"https://avatars.githubusercontent.com/u/14985020?v=4"}
					placeholder="blur"
					className="w-60 rounded-lg"
				/>
			</figure>
		</main>
	)
}
