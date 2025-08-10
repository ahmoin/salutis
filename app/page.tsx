"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
// import Link from "next/link";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
	return (
		<>
			<header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-zinc-800 flex flex-row justify-between items-center">
				Salutis
				<SignOutButton />
			</header>
			<main className="p-8 flex flex-col gap-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-2">Salutis</h1>
					<p className="text-muted-foreground text-lg">
						Your mental health companion
					</p>
				</div>
				<MentalHealthCourses />
			</main>
		</>
	);
}

function SignOutButton() {
	const { isAuthenticated } = useConvexAuth();
	const { signOut } = useAuthActions();
	const router = useRouter();
	return (
		<>
			{isAuthenticated && (
				<Button
					variant="outline"
					onClick={() =>
						void signOut().then(() => {
							router.push("/signin");
						})
					}
				>
					Sign out
				</Button>
			)}
		</>
	);
}

function MentalHealthCourses() {
	const { isAuthenticated } = useConvexAuth();
	const courses = useQuery(api.courses.getCourses);
	const userCourses = useQuery(api.courses.getUserCourses);
	const needsInit = useQuery(api.courses.needsInitialization);
	const startCourse = useMutation(api.courses.startCourse);
	const ensureCoursesExist = useMutation(api.courses.ensureCoursesExist);
	const [startingCourse, setStartingCourse] = useState<string | null>(null);

	// Automatically ensure courses exist when needed
	useEffect(() => {
		const initializeCourses = async () => {
			if (needsInit === true) {
				try {
					await ensureCoursesExist({});
				} catch (error) {
					console.error("Failed to initialize courses:", error);
				}
			}
		};

		initializeCourses();
	}, [needsInit, ensureCoursesExist]);

	const router = useRouter();

	const handleStartCourse = async (courseId: string) => {
		if (!isAuthenticated) {
			toast.error("Please sign in to start a course");
			return;
		}

		setStartingCourse(courseId);
		try {
			await startCourse({ courseId: courseId as any });
			toast.success("Course started successfully!");
			// Redirect to the course page
			router.push(`/course/${courseId}`);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to start course",
			);
		} finally {
			setStartingCourse(null);
		}
	};

	const handleViewCourse = (courseId: string) => {
		router.push(`/course/${courseId}`);
	};

	const isEnrolledInCourse = (courseId: string) => {
		return userCourses?.some((uc) => uc.courseId === courseId);
	};

	if (courses === undefined || needsInit === undefined) {
		return (
			<div className="max-w-6xl mx-auto">
				<div className="text-center">
					<p>Loading courses...</p>
				</div>
			</div>
		);
	}

	if (needsInit === true || courses.length === 0) {
		return (
			<div className="max-w-6xl mx-auto">
				<div className="text-center">
					<p>Setting up courses...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-6xl mx-auto">
			<h2 className="text-2xl font-semibold mb-6">Available Courses</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{courses.map((course) => {
					const isEnrolled = isEnrolledInCourse(course._id);
					const isStarting = startingCourse === course._id;
					const userCourse = userCourses?.find(uc => uc.courseId === course._id);
					const completedModules = userCourse?.completedModules?.length || 0;
					const progressPercentage = isEnrolled ? Math.round((completedModules / course.modules.length) * 100) : 0;

					return (
						<Card
							key={course._id}
							className="hover:shadow-lg transition-shadow"
						>
							<CardHeader>
								<div className="flex items-center justify-between mb-2">
									<CardTitle className="text-lg">{course.title}</CardTitle>
									{isEnrolled && (
										<span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
											{userCourse?.isCompleted ? "Completed" : `${progressPercentage}%`}
										</span>
									)}
								</div>
								<CardDescription>{course.description}</CardDescription>
								
								{/* Progress bar for enrolled courses */}
								{isEnrolled && (
									<div className="w-full bg-muted rounded-full h-1.5 mt-3">
										<div 
											className="bg-primary h-1.5 rounded-full transition-all duration-300"
											style={{ width: `${progressPercentage}%` }}
										/>
									</div>
								)}
							</CardHeader>
							<CardContent>
								<div className="space-y-2 mb-4">
									<p className="text-sm font-medium text-muted-foreground">
										Modules:
									</p>
									<ul className="text-sm space-y-1">
										{course.modules.map((module) => (
											<li key={module} className="flex items-center gap-2">
												<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
												{module}
											</li>
										))}
									</ul>
								</div>
								{isEnrolled ? (
									<Button
										className="w-full"
										onClick={() => handleViewCourse(course._id)}
										variant="outline"
									>
										Continue Course
									</Button>
								) : (
									<Button
										className="w-full"
										onClick={() => handleStartCourse(course._id)}
										disabled={isStarting || !isAuthenticated}
									>
										{isStarting ? "Starting..." : "Start Course"}
									</Button>
								)}
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}

// function Content() {
// 	const { viewer, numbers } =
// 		useQuery(api.myFunctions.listNumbers, {
// 			count: 10,
// 		}) ?? {};
// 	const addNumber = useMutation(api.myFunctions.addNumber);

// 	if (viewer === undefined || numbers === undefined) {
// 		return (
// 			<div className="mx-auto">
// 				<p>loading... (consider a loading skeleton)</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className="flex flex-col gap-8 max-w-lg mx-auto">
// 			<p>Welcome {viewer ?? "Anonymous"}!</p>
// 			<p>
// 				Click the button below and open this page in another window - this data
// 				is persisted in the Convex cloud database!
// 			</p>
// 			<p>
// 				<button
// 					className="bg-foreground text-background text-sm px-4 py-2 rounded-md"
// 					onClick={() => {
// 						void addNumber({ value: Math.floor(Math.random() * 10) });
// 					}}
// 				>
// 					Add a random number
// 				</button>
// 			</p>
// 			<p>
// 				Numbers:{" "}
// 				{numbers?.length === 0
// 					? "Click the button!"
// 					: (numbers?.join(", ") ?? "...")}
// 			</p>
// 			<p>
// 				Edit{" "}
// 				<code className="text-sm font-bold font-mono bg-zinc-800 px-1 py-0.5 rounded-md">
// 					convex/myFunctions.ts
// 				</code>{" "}
// 				to change your backend
// 			</p>
// 			<p>
// 				Edit{" "}
// 				<code className="text-sm font-bold font-mono bg-zinc-800 px-1 py-0.5 rounded-md">
// 					app/page.tsx
// 				</code>{" "}
// 				to change your frontend
// 			</p>
// 			<p>
// 				See the{" "}
// 				<Link href="/server" className="underline hover:no-underline">
// 					/server route
// 				</Link>{" "}
// 				for an example of loading data in a server component
// 			</p>
// 			<div className="flex flex-col">
// 				<p className="text-lg font-bold">Useful resources:</p>
// 				<div className="flex gap-2">
// 					<div className="flex flex-col gap-2 w-1/2">
// 						<ResourceCard
// 							title="Convex docs"
// 							description="Read comprehensive documentation for all Convex features."
// 							href="https://docs.convex.dev/home"
// 						/>
// 						<ResourceCard
// 							title="Stack articles"
// 							description="Learn about best practices, use cases, and more from a growing
//             collection of articles, videos, and walkthroughs."
// 							href="https://www.typescriptlang.org/docs/handbook/2/basic-types.html"
// 						/>
// 					</div>
// 					<div className="flex flex-col gap-2 w-1/2">
// 						<ResourceCard
// 							title="Templates"
// 							description="Browse our collection of templates to get started quickly."
// 							href="https://www.convex.dev/templates"
// 						/>
// 						<ResourceCard
// 							title="Discord"
// 							description="Join our developer community to ask questions, trade tips & tricks,
//             and show off your projects."
// 							href="https://www.convex.dev/community"
// 						/>
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

// function ResourceCard({
// 	title,
// 	description,
// 	href,
// }: {
// 	title: string;
// 	description: string;
// 	href: string;
// }) {
// 	return (
// 		<div className="flex flex-col gap-2 bg-zinc-800 p-4 rounded-md h-28 overflow-auto">
// 			<a href={href} className="text-sm underline hover:no-underline">
// 				{title}
// 			</a>
// 			<p className="text-xs">{description}</p>
// 		</div>
// 	);
// }
