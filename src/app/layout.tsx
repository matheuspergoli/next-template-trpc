import "@/styles/globals.css"

import React from "react"
import type { Metadata, Viewport } from "next"
import Link from "next/link"

import { cn } from "@/libs/utils"
import { Provider } from "@/providers/main-provider"
import { SessionProvider } from "@/providers/session"
import { ThemeProvider } from "@/providers/theme"
import { ThemeMode } from "@/shared/components/theme-mode"
import { routes } from "@/shared/navigation/routes"
import { TRPCReactProvider } from "@/shared/trpc/client"
import { buttonVariants } from "@/shared/ui/button"
import { Toaster } from "@/shared/ui/sonner"

export const metadata: Metadata = {
	title: "Template Next.js 14 App Router Template",
	description: "Created by Matheus Pergoli"
}

export const viewport: Viewport = {
	initialScale: 1,
	width: "device-width"
}

export default function RootLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body>
				<Provider providers={[SessionProvider, TRPCReactProvider, ThemeProvider]}>
					<header className="border-b">
						<nav className="container mx-auto flex h-14 items-center justify-between">
							<ThemeMode />

							<ul className="flex gap-3">
								<li>
									<Link
										href={routes.home()}
										className={cn(
											buttonVariants({ variant: "outline" }),
											"font-semibold"
										)}>
										Home
									</Link>
								</li>

								<li>
									<Link
										href={routes.hello({
											name: "Matheus",
											search: { surname: "Pergoli" }
										})}
										className={cn(
											buttonVariants({ variant: "outline" }),
											"font-semibold"
										)}>
										Hello
									</Link>
								</li>
							</ul>
						</nav>
					</header>

					{children}
					<Toaster />
				</Provider>
			</body>
		</html>
	)
}
