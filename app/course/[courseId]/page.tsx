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
import {
	CheckCircle,
	Circle,
	ArrowLeft,
	BookOpen,
	AlertCircle,
	Heart,
	Brain,
} from "lucide-react";
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
					<Button onClick={() => router.push("/dashboard")}>
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
					<Button onClick={() => router.push("/dashboard")}>
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
						onClick={() => router.push("/dashboard")}
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
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold mb-6">Course Modules</h2>

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
													{isCompleted ? "Completed" : "Ready to learn"}
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

								<CardContent className="space-y-4">
									<ModuleContent
										courseName={course.title}
										moduleName={module}
										isCompleted={isCompleted}
									/>
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

function ModuleContent({
	courseName,
	moduleName,
	isCompleted,
}: {
	courseName: string;
	moduleName: string;
	isCompleted: boolean;
}) {
	const getModuleContent = () => {
		const courseKey = courseName.toLowerCase();
		const moduleKey = moduleName.toLowerCase();

		// Content database for different courses and modules
		const contentDatabase: Record<
			string,
			Record<
				string,
				{
					icon: React.ReactNode;
					sections: Array<{
						title: string;
						content: string[];
						tips?: string[];
					}>;
				}
			>
		> = {
			"depression course": {
				"symptoms of depression": {
					icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
					sections: [
						{
							title: "Common Symptoms",
							content: [
								"Persistent sadness, anxiety, or empty mood lasting most of the day",
								"Loss of interest or pleasure in activities once enjoyed",
								"Significant weight loss or gain, or changes in appetite",
								"Sleep disturbances (insomnia or oversleeping)",
								"Fatigue or loss of energy nearly every day",
							],
						},
						{
							title: "Emotional Signs",
							content: [
								"Feelings of worthlessness or excessive guilt",
								"Difficulty concentrating or making decisions",
								"Recurrent thoughts of death or suicide",
								"Irritability or restlessness",
								"Feeling hopeless about the future",
							],
						},
						{
							title: "When to Seek Help",
							content: [
								"Symptoms persist for more than two weeks",
								"Symptoms interfere with daily activities",
								"You have thoughts of self-harm",
								"Family or friends express concern about changes in your behavior",
							],
							tips: [
								"Keep a mood diary to track patterns",
								"Don't ignore persistent symptoms",
								"Reach out to trusted friends or family",
							],
						},
					],
				},
				"how to cope with depression": {
					icon: <Heart className="w-5 h-5 text-red-500" />,
					sections: [
						{
							title: "Daily Coping Strategies",
							content: [
								"Establish a daily routine to provide structure",
								"Practice mindfulness and meditation for 10-15 minutes daily",
								"Engage in regular physical activity, even light walking",
								"Maintain social connections, even when you don't feel like it",
								"Get adequate sleep (7-9 hours) and maintain sleep hygiene",
							],
						},
						{
							title: "Cognitive Techniques",
							content: [
								"Challenge negative thought patterns",
								"Practice gratitude by writing down 3 things you're grateful for daily",
								"Use positive self-talk and affirmations",
								"Break large tasks into smaller, manageable steps",
								"Focus on the present moment rather than dwelling on the past",
							],
						},
						{
							title: "Self-Care Activities",
							content: [
								"Engage in hobbies or activities you once enjoyed",
								"Spend time in nature or sunlight",
								"Listen to uplifting music or podcasts",
								"Practice deep breathing exercises",
								"Maintain personal hygiene and appearance",
							],
							tips: [
								"Start small - even 5 minutes of activity helps",
								"Be patient with yourself during the healing process",
								"Celebrate small victories and progress",
							],
						},
					],
				},
				"how to overcome depression": {
					icon: <Brain className="w-5 h-5 text-green-500" />,
					sections: [
						{
							title: "Professional Treatment Options",
							content: [
								"Cognitive Behavioral Therapy (CBT) - helps identify and change negative thought patterns",
								"Interpersonal Therapy (IPT) - focuses on improving relationships and social functioning",
								"Medication options like antidepressants (consult with a psychiatrist)",
								"Group therapy for peer support and shared experiences",
								"Intensive outpatient programs for comprehensive care",
							],
						},
						{
							title: "Building Long-term Resilience",
							content: [
								"Develop a strong support network of family and friends",
								"Learn stress management techniques",
								"Create meaning and purpose in your life",
								"Set realistic goals and work towards them gradually",
								"Practice regular self-reflection and emotional awareness",
							],
						},
						{
							title: "Lifestyle Changes",
							content: [
								"Maintain a balanced diet rich in omega-3 fatty acids",
								"Limit alcohol and avoid recreational drugs",
								"Create a structured daily schedule",
								"Engage in regular exercise (aim for 30 minutes, 3-5 times per week)",
								"Practice good sleep hygiene",
							],
							tips: [
								"Recovery is a process, not a destination",
								"Setbacks are normal and part of healing",
								"Professional help is a sign of strength, not weakness",
							],
						},
					],
				},
			},
			"panic disorder course": {
				"symptoms of panic disorder": {
					icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
					sections: [
						{
							title: "Panic Attack Symptoms",
							content: [
								"Rapid heartbeat or palpitations",
								"Sweating and trembling or shaking",
								"Shortness of breath or feeling smothered",
								"Chest pain or discomfort",
								"Nausea or abdominal distress",
								"Dizziness or feeling faint",
								"Fear of losing control or 'going crazy'",
								"Fear of dying",
							],
						},
						{
							title: "Physical vs. Emotional Symptoms",
							content: [
								"Physical: Racing heart, sweating, trembling, difficulty breathing",
								"Emotional: Intense fear, feeling detached from reality",
								"Cognitive: Racing thoughts, fear of future attacks",
								"Behavioral: Avoidance of triggers or situations",
							],
						},
					],
				},
				"how to cope with panic disorder": {
					icon: <Heart className="w-5 h-5 text-purple-500" />,
					sections: [
						{
							title: "During a Panic Attack",
							content: [
								"Practice deep breathing: 4 counts in, hold for 4, out for 6",
								"Use grounding techniques: 5 things you see, 4 you hear, 3 you touch",
								"Remind yourself: 'This will pass, I am safe'",
								"Don't fight the feelings - accept them as temporary",
								"Find a safe, quiet space if possible",
							],
						},
						{
							title: "Prevention Strategies",
							content: [
								"Regular exercise to reduce overall anxiety",
								"Limit caffeine and alcohol intake",
								"Practice progressive muscle relaxation",
								"Maintain regular sleep schedule",
								"Learn to identify early warning signs",
							],
						},
					],
				},
				"how to overcome panic disorder": {
					icon: <Brain className="w-5 h-5 text-indigo-500" />,
					sections: [
						{
							title: "Treatment Approaches",
							content: [
								"Cognitive Behavioral Therapy (CBT) for panic disorder",
								"Exposure therapy to gradually face feared situations",
								"Medication options (SSRIs, benzodiazepines)",
								"Panic-focused psychodynamic psychotherapy",
								"Mindfulness-based stress reduction",
							],
						},
						{
							title: "Long-term Recovery",
							content: [
								"Build confidence through gradual exposure",
								"Develop a toolkit of coping strategies",
								"Create a support network",
								"Practice regular stress management",
								"Maintain healthy lifestyle habits",
							],
						},
					],
				},
			},
		};

		// Get content for the specific course and module
		const courseContent = contentDatabase[courseKey];
		if (!courseContent) {
			return {
				icon: <BookOpen className="w-5 h-5 text-gray-500" />,
				sections: [
					{
						title: "Course Content",
						content: [
							`This module covers important aspects of ${moduleName.toLowerCase()}.`,
						],
					},
				],
			};
		}

		const moduleContent = courseContent[moduleKey];
		if (!moduleContent) {
			return {
				icon: <BookOpen className="w-5 h-5 text-gray-500" />,
				sections: [
					{
						title: "Module Content",
						content: [
							`Learn about ${moduleName.toLowerCase()} and develop effective strategies.`,
						],
					},
				],
			};
		}

		return moduleContent;
	};

	const content = getModuleContent();

	return (
		<div className="space-y-6">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				{content.icon}
				<span>Educational Content</span>
			</div>

			{content.sections.map((section, index) => (
				<div key={index} className="space-y-3">
					<h4 className="font-semibold text-foreground">{section.title}</h4>
					<ul className="space-y-2">
						{section.content.map((item, itemIndex) => (
							<li key={itemIndex} className="flex items-start gap-2 text-sm">
								<div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
								<span className="text-muted-foreground">{item}</span>
							</li>
						))}
					</ul>

					{section.tips && (
						<div className="bg-muted/50 rounded-lg p-4 mt-4">
							<h5 className="font-medium text-sm mb-2 flex items-center gap-2">
								<Heart className="w-4 h-4 text-primary" />
								Helpful Tips
							</h5>
							<ul className="space-y-1">
								{section.tips.map((tip, tipIndex) => (
									<li
										key={tipIndex}
										className="text-sm text-muted-foreground flex items-start gap-2"
									>
										<div className="w-1 h-1 bg-primary rounded-full mt-2 flex-shrink-0" />
										{tip}
									</li>
								))}
							</ul>
						</div>
					)}
				</div>
			))}

			{!isCompleted && (
				<div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mt-6">
					<p className="text-sm text-primary font-medium">
						📚 Take your time to read through this content. When you're ready,
						mark this module as complete to continue your learning journey.
					</p>
				</div>
			)}
		</div>
	);
}
