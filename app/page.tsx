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
import { motion } from "motion/react";

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
						{"Your Mental Health".split(" ").map((word, index) => (
							<motion.span
								key={word}
								initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
								animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
									ease: "easeInOut",
								}}
								className="inline-block mr-3"
							>
								{word}
							</motion.span>
						))}{" "}
						<motion.span
							initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
							animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
							transition={{
								duration: 0.3,
								delay: 0.3,
								ease: "easeInOut",
							}}
							className="text-primary inline-block"
						>
							Companion
						</motion.span>
					</h1>
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.5 }}
						className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
					>
						Take control of your mental wellness with evidence-based courses,
						guided breathing exercises, and AI-powered support designed to help
						you understand, cope with, and overcome various mental health
						challenges.
					</motion.p>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.7 }}
						className="flex flex-col sm:flex-row gap-4 justify-center"
					>
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
					</motion.div>
				</div>

				<div className="py-20">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-3xl font-bold text-center text-foreground mb-12"
					>
						Comprehensive Mental Health Support
					</motion.h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{[
							{
								title: "Evidence-Based Courses",
								description:
									"Structured learning paths for depression, anxiety, trauma, bipolar disorder, OCD, and schizophrenia support.",
								icon: "📚",
								link: "/dashboard",
							},
							{
								title: "AI Mental Health Chat",
								description:
									"Get instant support and guidance from our AI assistant trained in mental health best practices.",
								icon: "🤖",
								link: "/chat",
							},
							{
								title: "Breathing Exercises",
								description:
									"Guided breathing patterns including 4-7-8 relaxation, box breathing, and energizing techniques.",
								icon: "🫁",
								link: "/breathing",
							},
							{
								title: "Depression Support",
								description:
									"Learn to recognize symptoms, develop coping strategies, and find your path to recovery.",
								icon: "💙",
								link: "/dashboard",
							},
							{
								title: "Anxiety Management",
								description:
									"Master techniques to manage panic disorders and reduce anxiety in daily life.",
								icon: "🌱",
								link: "/dashboard",
							},
							{
								title: "Trauma Recovery",
								description:
									"Evidence-based approaches to healing from PTSD and traumatic experiences.",
								icon: "🌟",
								link: "/dashboard",
							},
						].map((feature, index) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: index * 0.1 }}
								viewport={{ once: true }}
								whileHover={{ y: -5 }}
							>
								<Card className="hover:shadow-lg transition-all bg-card/60 backdrop-blur-sm h-full cursor-pointer">
									<CardHeader>
										<div className="text-3xl mb-2">{feature.icon}</div>
										<CardTitle className="text-xl">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<CardDescription className="mb-4">
											{feature.description}
										</CardDescription>
										<Button
											variant="outline"
											size="sm"
											onClick={() => router.push(feature.link)}
											className="w-full"
										>
											Explore
										</Button>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="py-20 text-center"
				>
					<div className="bg-primary rounded-2xl p-12 text-primary-foreground">
						<motion.h2
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							viewport={{ once: true }}
							className="text-3xl font-bold mb-4"
						>
							Ready to Begin Your Healing Journey?
						</motion.h2>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							viewport={{ once: true }}
							className="text-xl mb-8 opacity-90"
						>
							Join thousands who have found support, understanding, and hope
							through our comprehensive mental health platform.
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.6 }}
							viewport={{ once: true }}
						>
							<Button
								size="lg"
								onClick={() => router.push("/signin")}
								variant="secondary"
								className="text-lg px-8 py-3"
							>
								Get Started Today
							</Button>
						</motion.div>
					</div>
				</motion.div>
			</main>
		</div>
	);
}
