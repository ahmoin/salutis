"use client";

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

interface SiteHeaderProps {
	currentPage?: "courses" | "chat" | "breathing";
}

export function SiteHeader({ currentPage }: SiteHeaderProps) {
	const router = useRouter();
	const { isAuthenticated } = useConvexAuth();
	const { signOut } = useAuthActions();

	return (
		<header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-zinc-800 flex flex-row justify-between items-center">
			<div className="flex items-center gap-8">
				<Link href="/dashboard">
					<div className="flex flex-row items-center gap-2">
						<div className="text-primary-foreground flex size-8 items-center justify-center rounded-md">
							<Image
								className="size-8"
								src="/salutis.svg"
								alt="Salutis logo"
								width={48}
								height={48}
							/>
						</div>
						<span className="text-xl font-bold">Salutis</span>
					</div>
				</Link>

				<nav className="flex items-center gap-4">
					<Button
						variant="ghost"
						asChild
						className={`font-medium ${
							currentPage === "courses" ? "text-primary" : ""
						}`}
					>
						<Link href="/dashboard">Courses</Link>
					</Button>
					<Button
						variant="ghost"
						asChild
						className={`font-medium ${
							currentPage === "breathing" ? "text-primary" : ""
						}`}
					>
						<Link href="/breathing">Breathing</Link>
					</Button>
					<Button
						variant="ghost"
						asChild
						className={`font-medium ${
							currentPage === "chat" ? "text-primary" : ""
						}`}
					>
						<Link href="/chat">Chat</Link>
					</Button>
				</nav>
			</div>
			{isAuthenticated && (
				<Button
					variant="outline"
					onClick={() =>
						void signOut().then(() => {
							router.push("/");
						})
					}
				>
					Sign out
				</Button>
			)}
		</header>
	);
}
