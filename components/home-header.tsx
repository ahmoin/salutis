"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HomeHeader() {
	return (
		<header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center py-4">
					<Link href="/">
						<div className="flex items-center gap-3">
							<div className="text-primary-foreground flex size-8 items-center justify-center rounded-md">
								<Image
									className="size-8"
									src="/salutis.svg"
									alt="Salutis logo"
									width={48}
									height={48}
								/>
							</div>
							<span className="text-xl font-bold text-primary">Salutis</span>
						</div>
					</Link>
					<div className="flex items-center gap-4">
						<Button variant="ghost" asChild>
							<Link href="/signin">Login</Link>
						</Button>
						<Button asChild>
							<Link href="/signin">Get Started</Link>
						</Button>
					</div>
				</div>
			</div>
		</header>
	);
}
