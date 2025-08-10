"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { HomeHeader } from "@/components/home-header";

export default function Home() {
	const { isAuthenticated } = useConvexAuth();
	const router = useRouter();

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		}
	}, [isAuthenticated, router]);

	if (isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<p>Redirecting to dashboard...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-background to-muted/40">
			<HomeHeader />

			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="py-20 text-center">
					<h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
						Your Mental Health <span className="text-primary">Companion</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
						Take control of your mental wellness with evidence-based courses
						designed to help you understand, cope with, and overcome various
						mental health challenges.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							onClick={() => router.push("/signin")}
							className="text-lg px-8 py-3"
						>
							Start Your Journey
						</Button>
						<Button
							size="lg"
							variant="outline"
							onClick={() => router.push("/signin")}
							className="text-lg px-8 py-3"
						>
							Learn More
						</Button>
					</div>
				</div>

				<div className="py-20">
					<h2 className="text-3xl font-bold text-center text-foreground mb-12">
						Comprehensive Mental Health Support
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "Depression Support",
								description:
									"Learn to recognize symptoms, develop coping strategies, and find your path to recovery.",
								icon: "💙",
							},
							{
								title: "Anxiety Management",
								description:
									"Master techniques to manage panic disorders and reduce anxiety in daily life.",
								icon: "🌱",
							},
							{
								title: "Trauma Recovery",
								description:
									"Evidence-based approaches to healing from PTSD and traumatic experiences.",
								icon: "🌟",
							},
							{
								title: "Mood Stability",
								description:
									"Understand and manage bipolar disorder with practical tools and insights.",
								icon: "⚖️",
							},
							{
								title: "OCD Management",
								description:
									"Break free from obsessive-compulsive patterns with proven strategies.",
								icon: "🔄",
							},
							{
								title: "Schizophrenia Support",
								description:
									"Comprehensive guidance for understanding and managing schizophrenia.",
								icon: "🧠",
							},
						].map((feature) => (
							<Card
								key={feature.title}
								className="hover:shadow-lg transition-shadow bg-card/60 backdrop-blur-sm"
							>
								<CardHeader>
									<div className="text-3xl mb-2">{feature.icon}</div>
									<CardTitle className="text-xl">{feature.title}</CardTitle>
								</CardHeader>
								<CardContent>
									<CardDescription>{feature.description}</CardDescription>
								</CardContent>
							</Card>
						))}
					</div>
				</div>

				<div className="py-20 text-center">
					<div className="bg-primary rounded-2xl p-12 text-primary-foreground">
						<h2 className="text-3xl font-bold mb-4">
							Ready to Begin Your Healing Journey?
						</h2>
						<p className="text-xl mb-8 opacity-90">
							Use our resources to find support, understanding, and hope.
						</p>
						<Button
							size="lg"
							onClick={() => router.push("/signin")}
							variant="secondary"
							className="text-lg px-8 py-3"
						>
							Get Started Today
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}
