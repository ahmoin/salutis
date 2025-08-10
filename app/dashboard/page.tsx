"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
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
import Image from "next/image";

export default function Dashboard() {
	return (
		<>
			<header className="sticky top-0 z-10 bg-background p-4 border-b-2 border-zinc-800 flex flex-row justify-between items-center">
				<div className="flex flex-row items-center">
					<div className="text-primary-foreground flex size-8 items-center justify-center rounded-md">
						<Image
							className="size-8"
							src="/salutis.svg"
							alt="Salutis logo"
							width={48}
							height={48}
						/>
					</div>
					Salutis
				</div>
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
							router.push("/");
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
	const [startingCourse, setStartingCourse] = useState<Id<"courses"> | null>(
		null,
	);

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

	const handleStartCourse = async (courseId: Id<"courses">) => {
		if (!isAuthenticated) {
			toast.error("Please sign in to start a course");
			return;
		}

		setStartingCourse(courseId);
		try {
			await startCourse({ courseId });
			toast.success("Course started successfully!");
			router.push(`/course/${courseId}`);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to start course",
			);
		} finally {
			setStartingCourse(null);
		}
	};

	const handleViewCourse = (courseId: Id<"courses">) => {
		router.push(`/course/${courseId}`);
	};

	const isEnrolledInCourse = (courseId: Id<"courses">) => {
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
					const userCourse = userCourses?.find(
						(uc) => uc.courseId === course._id,
					);
					const completedModules = userCourse?.completedModules?.length || 0;
					const progressPercentage = isEnrolled
						? Math.round((completedModules / course.modules.length) * 100)
						: 0;

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
											{userCourse?.isCompleted
												? "Completed"
												: `${progressPercentage}%`}
										</span>
									)}
								</div>
								<CardDescription>{course.description}</CardDescription>

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
