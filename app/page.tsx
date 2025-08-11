"use client";

import { useConvexAuth } from "convex/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HomeHeader } from "@/components/home-header";
import { motion } from "motion/react";

export default function Home() {
	const { isAuthenticated } = useConvexAuth();
	const router = useRouter();

	const scrollToFeatures = () => {
		const featuresSection = document.getElementById("features-section");
		if (featuresSection) {
			featuresSection.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	};

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
							onClick={scrollToFeatures}
							className="text-lg px-8 py-3"
						>
							Learn More
						</Button>
					</motion.div>
				</div>

				<div id="features-section" className="py-20">
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						viewport={{ once: true }}
						className="text-3xl font-bold text-center text-foreground mb-12"
					>
						Comprehensive Mental Health Support
					</motion.h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
						<CoursesCard router={router} />
						<ChatCard router={router} />
						<BreathingCard router={router} />
						<DepressionCard router={router} />
						<AnxietyCard router={router} />
						<TraumaCard router={router} />
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

function FeatureCard({
	feature,
	router,
	index,
}: {
	feature: {
		title: string;
		description: string;
		icon: string;
		link: string;
	};
	router: any;
	index: number;
}) {
	const [isHovered, setIsHovered] = useState(false);

	const handleClick = () => {
		router.push(feature.link);
	};

	const getAnimationVariant = () => {
		const variants = [
			{ initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } },
			{ initial: { opacity: 0, y: 50 }, animate: { opacity: 1, y: 0 } },
			{ initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } },
			{
				initial: { opacity: 0, scale: 0.8 },
				animate: { opacity: 1, scale: 1 },
			},
			{
				initial: { opacity: 0, rotate: -10 },
				animate: { opacity: 1, rotate: 0 },
			},
			{ initial: { opacity: 0, y: -50 }, animate: { opacity: 1, y: 0 } },
		];
		return variants[index % variants.length];
	};

	const variant = getAnimationVariant();

	return (
		<motion.div
			initial={variant.initial}
			whileInView={variant.animate}
			transition={{
				duration: 0.6,
				delay: index * 0.1,
				type: "spring",
				stiffness: 100,
				damping: 15,
			}}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				scale: 1.02,
				transition: { duration: 0.2 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={handleClick}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 h-full hover:shadow-xl hover:border-primary/20 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-4">
					<motion.div
						className="text-4xl"
						animate={
							isHovered
								? {
										scale: [1, 1.2, 1],
										rotate: [0, 10, -10, 0],
									}
								: {
										scale: [1, 1.05, 1],
										rotate: [0, 2, -2, 0],
									}
						}
						transition={{
							duration: isHovered ? 0.5 : 2,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: isHovered ? 0 : 3,
						}}
					>
						{feature.icon}
					</motion.div>

					<motion.h3
						className="text-xl font-bold text-foreground"
						animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
						transition={{ duration: 0.2 }}
					>
						{feature.title}
					</motion.h3>

					<motion.p
						className="text-sm text-muted-foreground leading-relaxed"
						initial={{ opacity: 0.8 }}
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.2 }}
					>
						{feature.description}
					</motion.p>
				</div>
			</div>
		</motion.div>
	);
}

function CoursesCard({ router }: { router: any }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			whileInView={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => router.push("/dashboard")}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-background border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-6">
					<motion.div
						className="text-5xl"
						animate={
							isHovered ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }
						}
						transition={{
							duration: isHovered ? 0.4 : 2,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: 3,
						}}
					>
						📚
					</motion.div>

					<motion.h3
						className="text-2xl font-bold text-foreground"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Evidence-Based Courses
					</motion.h3>

					<motion.p
						className="text-muted-foreground leading-relaxed"
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						Structured learning paths for depression, anxiety, trauma, bipolar
						disorder, OCD, and schizophrenia support.
					</motion.p>

					<motion.div
						className="flex space-x-2"
						animate={isHovered ? { y: -3 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{["📖", "🎯", "🧠"].map((emoji, i) => (
							<motion.span
								key={emoji}
								className="text-lg"
								animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
								transition={{ delay: i * 0.1, duration: 0.3 }}
							>
								{emoji}
							</motion.span>
						))}
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}

function ChatCard({ router }: { router: any }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.1 }}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => router.push("/chat")}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-background border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-6">
					<motion.div
						className="text-5xl relative"
						animate={
							isHovered ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }
						}
						transition={{
							duration: isHovered ? 0.4 : 2.5,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: 2,
						}}
					>
						🤖
						<motion.div
							className="absolute -top-2 -right-2 w-3 h-3 bg-primary rounded-full"
							animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						/>
					</motion.div>

					<motion.h3
						className="text-2xl font-bold text-foreground"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						AI Mental Health Chat
					</motion.h3>

					<motion.p
						className="text-muted-foreground leading-relaxed"
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						Get instant support and guidance from our AI assistant trained in
						mental health best practices.
					</motion.p>

					<motion.div
						className="flex items-center space-x-1 text-sm text-primary"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						<motion.span
							animate={{ opacity: [1, 0.5, 1] }}
							transition={{ duration: 1, repeat: Infinity }}
						>
							●
						</motion.span>
						<span className="font-semibold">Online Now</span>
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}

function BreathingCard({ router }: { router: any }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.2 }}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => router.push("/breathing")}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-background border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-6">
					<motion.div
						className="text-5xl"
						animate={
							isHovered
								? { scale: [1, 1.1, 1] }
								: { scale: [1, 1.1, 0.95, 1.1, 1] }
						}
						transition={{
							duration: isHovered ? 0.4 : 4,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: 1,
							ease: "easeInOut",
						}}
					>
						🫁
					</motion.div>

					<motion.h3
						className="text-2xl font-bold text-foreground"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Breathing Exercises
					</motion.h3>

					<motion.p
						className="text-muted-foreground leading-relaxed"
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						Guided breathing patterns including 4-7-8 relaxation, box breathing,
						and energizing techniques.
					</motion.p>

					<motion.div
						className="flex items-center space-x-3"
						animate={isHovered ? { y: -3 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{[1, 2, 3, 4].map((i) => (
							<motion.div
								key={i}
								className="w-2 h-2 bg-primary rounded-full"
								animate={
									isHovered
										? {
												scale: [1, 1.3, 1],
												opacity: [0.5, 1, 0.5],
											}
										: {
												scale: [1, 1.1, 1],
												opacity: [0.4, 0.8, 0.4],
											}
								}
								transition={{
									duration: 2,
									repeat: Infinity,
									delay: i * 0.2,
								}}
							/>
						))}
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}

function DepressionCard({ router }: { router: any }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.8 }}
			whileInView={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.3 }}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => router.push("/dashboard")}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-background border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-6">
					<motion.div
						className="text-5xl"
						animate={
							isHovered ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }
						}
						transition={{
							duration: isHovered ? 0.4 : 3,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: 2,
						}}
					>
						💙
					</motion.div>

					<motion.h3
						className="text-2xl font-bold text-foreground"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Depression Support
					</motion.h3>

					<motion.p
						className="text-muted-foreground leading-relaxed"
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						Learn to recognize symptoms, develop coping strategies, and find
						your path to recovery.
					</motion.p>

					<motion.div
						className="text-sm text-primary font-semibold"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						You're not alone ✨
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}

function AnxietyCard({ router }: { router: any }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.4 }}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => router.push("/dashboard")}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-background border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-6">
					<motion.div
						className="text-5xl"
						animate={
							isHovered ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }
						}
						transition={{
							duration: isHovered ? 0.4 : 2.5,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: 2,
						}}
					>
						🌱
					</motion.div>

					<motion.h3
						className="text-2xl font-bold text-foreground"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Anxiety Management
					</motion.h3>

					<motion.p
						className="text-muted-foreground leading-relaxed"
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						Master techniques to manage panic disorders and reduce anxiety in
						daily life.
					</motion.p>

					<motion.div
						className="flex space-x-2"
						animate={isHovered ? { y: -3 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						{["🧘", "🌸", "🕊️"].map((emoji, i) => (
							<motion.span
								key={emoji}
								className="text-lg"
								animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
								transition={{ delay: i * 0.1, duration: 0.3 }}
							>
								{emoji}
							</motion.span>
						))}
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}

function TraumaCard({ router }: { router: any }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, type: "spring", stiffness: 100, delay: 0.5 }}
			viewport={{ once: true }}
			whileHover={{
				y: -8,
				transition: { duration: 0.3 },
			}}
			whileTap={{ scale: 0.98 }}
			onClick={() => router.push("/dashboard")}
			onHoverStart={() => setIsHovered(true)}
			onHoverEnd={() => setIsHovered(false)}
			className="cursor-pointer"
		>
			<div className="bg-background border border-border rounded-2xl p-8 h-full hover:shadow-lg hover:border-primary/50 transition-all duration-300">
				<div className="flex flex-col items-center text-center space-y-6">
					<motion.div
						className="text-5xl"
						animate={
							isHovered ? { scale: [1, 1.1, 1] } : { scale: [1, 1.05, 1] }
						}
						transition={{
							duration: isHovered ? 0.4 : 3.5,
							repeat: isHovered ? 0 : Infinity,
							repeatDelay: 2,
						}}
					>
						🌟
					</motion.div>

					<motion.h3
						className="text-2xl font-bold text-foreground"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Trauma Recovery
					</motion.h3>

					<motion.p
						className="text-muted-foreground leading-relaxed"
						animate={isHovered ? { opacity: 1 } : { opacity: 0.8 }}
						transition={{ duration: 0.3 }}
					>
						Evidence-based approaches to healing from PTSD and traumatic
						experiences.
					</motion.p>

					<motion.div
						className="text-sm text-primary font-semibold"
						animate={isHovered ? { y: -2 } : { y: 0 }}
						transition={{ duration: 0.3 }}
					>
						Healing is possible 🌈
					</motion.div>
				</div>
			</div>
		</motion.div>
	);
}
