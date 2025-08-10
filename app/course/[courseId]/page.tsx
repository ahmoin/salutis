"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function CoursePage() {
	const params = useParams();
	const router = useRouter();
	const courseId = params.courseId as Id<"courses">;

	const courses = useQuery(api.courses.getCourses);
	const userCourses = useQuery(api.courses.getUserCourses);
	const completeModule = useMutation(api.courses.completeModule);

	const course = courses?.find((c) => c._id === courseId);
	const userCourse = userCourses?.find((uc) => uc.courseId === courseId);

	const handleCompleteModule = async (moduleName: string) => {
		if (!userCourse) {
			toast.error("You must be enrolled in this course");
			return;
		}

		try {
			await completeModule({
				userCourseId: userCourse._id,
				moduleName,
			});
			toast.success(`Completed: ${moduleName}`);
		} catch (error) {
			if (error) {
				toast.error("Failed to complete module");
			}
		}
	};

	if (courses === undefined || userCourses === undefined) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-4xl mx-auto">
					<p>Loading course...</p>
				</div>
			</div>
		);
	}

	if (!course) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
					<Button onClick={() => router.push("/")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>
				</div>
			</div>
		);
	}

	if (!userCourse) {
		return (
			<div className="min-h-screen p-8">
				<div className="max-w-4xl mx-auto">
					<h1 className="text-2xl font-bold mb-4">Access Denied</h1>
					<p className="mb-4">
						You must be enrolled in this course to view it.
					</p>
					<Button onClick={() => router.push("/")}>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>
				</div>
			</div>
		);
	}

	const completedModules = userCourse.completedModules || [];
	const progressPercentage = Math.round(
		(completedModules.length / course.modules.length) * 100,
	);

	return (
		<div className="min-h-screen p-8">
			<div className="max-w-4xl mx-auto">
				{/* Header */}
				<div className="mb-8">
					<Button
						variant="ghost"
						onClick={() => router.push("/")}
						className="mb-4"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Dashboard
					</Button>

					<div className="flex items-center justify-between mb-4">
						<h1 className="text-3xl font-bold">{course.title}</h1>
						<Badge variant={userCourse.isCompleted ? "default" : "secondary"}>
							{userCourse.isCompleted
								? "Completed"
								: `${progressPercentage}% Complete`}
						</Badge>
					</div>

					<p className="text-muted-foreground text-lg mb-4">
						{course.description}
					</p>

					{/* Progress Bar */}
					<div className="w-full bg-muted rounded-full h-2 mb-6">
						<div
							className="bg-primary h-2 rounded-full transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>

				{/* Course Modules */}
				<div className="space-y-4">
					<h2 className="text-2xl font-semibold mb-4">Course Modules</h2>

					{course.modules.map((module, index) => {
						const isCompleted = completedModules.includes(module);

						return (
							<Card key={module} className="transition-all hover:shadow-md">
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											{isCompleted ? (
												<CheckCircle className="w-6 h-6 text-green-500" />
											) : (
												<Circle className="w-6 h-6 text-muted-foreground" />
											)}
											<div>
												<CardTitle className="text-lg">
													Module {index + 1}: {module}
												</CardTitle>
												<CardDescription>
													{isCompleted ? "Completed" : "Not started"}
												</CardDescription>
											</div>
										</div>

										{!isCompleted && (
											<Button
												onClick={() => handleCompleteModule(module)}
												size="sm"
											>
												Mark Complete
											</Button>
										)}
									</div>
								</CardHeader>

								{/* Module content placeholder */}
								<CardContent>
									<p className="text-muted-foreground">
										This module covers important aspects of{" "}
										{module.toLowerCase()}. Complete this module to progress in
										your mental health journey.
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>

				{/* Completion Message */}
				{userCourse.isCompleted && (
					<Card className="mt-8 border-green-200 bg-green-50">
						<CardContent className="pt-6">
							<div className="text-center">
								<CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
								<h3 className="text-xl font-semibold text-green-800 mb-2">
									Congratulations! 🎉
								</h3>
								<p className="text-green-700">
									You have successfully completed the {course.title}. Great job
									on your mental health journey!
								</p>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
