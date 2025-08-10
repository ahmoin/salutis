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

					<div className="w-full bg-muted rounded-full h-2 mb-6">
						<div
							className="bg-primary h-2 rounded-full transition-all duration-300"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>

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
			"bipolar disorder course": {
				"symptoms of bipolar disorder": {
					icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
					sections: [
						{
							title: "Manic Episode Symptoms",
							content: [
								"Elevated, expansive, or irritable mood lasting at least one week",
								"Decreased need for sleep (feeling rested after only 3 hours)",
								"Grandiosity or inflated self-esteem",
								"More talkative than usual or pressure to keep talking",
								"Racing thoughts or flight of ideas",
								"Distractibility and difficulty concentrating",
								"Increased goal-directed activity or psychomotor agitation",
								"Risky behavior with potential negative consequences",
							],
						},
						{
							title: "Depressive Episode Symptoms",
							content: [
								"Persistent sad, anxious, or empty mood",
								"Loss of interest in activities once enjoyed",
								"Significant weight loss or gain",
								"Sleep disturbances (insomnia or hypersomnia)",
								"Fatigue or loss of energy",
								"Feelings of worthlessness or excessive guilt",
								"Difficulty thinking, concentrating, or making decisions",
								"Recurrent thoughts of death or suicide",
							],
						},
						{
							title: "Mixed Episodes",
							content: [
								"Symptoms of both mania and depression occurring simultaneously",
								"Rapid cycling between mood states",
								"Increased risk of suicide during mixed episodes",
								"Agitation combined with depressed mood",
							],
							tips: [
								"Track mood changes in a daily mood chart",
								"Learn to recognize early warning signs",
								"Maintain regular sleep and eating schedules",
							],
						},
					],
				},
				"how to cope with bipolar disorder": {
					icon: <Heart className="w-5 h-5 text-pink-500" />,
					sections: [
						{
							title: "Daily Management Strategies",
							content: [
								"Maintain a consistent daily routine and sleep schedule",
								"Use mood tracking apps or journals to monitor patterns",
								"Take medications as prescribed, even when feeling well",
								"Avoid alcohol and recreational drugs",
								"Practice stress reduction techniques like meditation",
								"Stay connected with supportive family and friends",
								"Recognize and avoid personal triggers",
							],
						},
						{
							title: "Managing Manic Episodes",
							content: [
								"Stick to your medication regimen",
								"Avoid making major decisions during manic periods",
								"Limit stimulating activities and environments",
								"Get adequate sleep (use sleep aids if prescribed)",
								"Remove access to credit cards or large amounts of money",
								"Have a trusted person monitor your behavior",
							],
						},
						{
							title: "Managing Depressive Episodes",
							content: [
								"Maintain basic self-care routines",
								"Engage in gentle physical activity",
								"Practice mindfulness and grounding techniques",
								"Reach out to your support network",
								"Follow your treatment plan consistently",
								"Avoid isolation and maintain social connections",
							],
							tips: [
								"Create a crisis plan with emergency contacts",
								"Keep a list of warning signs visible",
								"Build a strong support team including professionals",
							],
						},
					],
				},
				"how to overcome bipolar disorder": {
					icon: <Brain className="w-5 h-5 text-purple-500" />,
					sections: [
						{
							title: "Professional Treatment",
							content: [
								"Mood stabilizers (lithium, anticonvulsants)",
								"Antipsychotic medications for severe episodes",
								"Cognitive Behavioral Therapy (CBT)",
								"Interpersonal and Social Rhythm Therapy (IPSRT)",
								"Family-focused therapy",
								"Group therapy and peer support programs",
							],
						},
						{
							title: "Long-term Stability",
							content: [
								"Develop excellent medication adherence habits",
								"Build a comprehensive support network",
								"Learn advanced stress management techniques",
								"Create structured daily routines",
								"Maintain regular medical and therapy appointments",
								"Educate family and friends about the condition",
							],
						},
						{
							title: "Lifestyle Modifications",
							content: [
								"Prioritize consistent sleep hygiene",
								"Maintain regular exercise routine",
								"Follow a balanced, nutritious diet",
								"Limit caffeine and avoid alcohol",
								"Practice regular relaxation techniques",
								"Engage in meaningful activities and hobbies",
							],
							tips: [
								"Recovery is possible with proper treatment",
								"Many people with bipolar disorder live full, productive lives",
								"Consistency in treatment is key to long-term success",
							],
						},
					],
				},
			},
			"post-traumatic stress disorder (ptsd) course": {
				"symptoms of ptsd": {
					icon: <AlertCircle className="w-5 h-5 text-red-500" />,
					sections: [
						{
							title: "Re-experiencing Symptoms",
							content: [
								"Intrusive memories or flashbacks of the traumatic event",
								"Distressing dreams or nightmares related to the trauma",
								"Severe emotional distress when exposed to trauma reminders",
								"Physical reactions (sweating, nausea, rapid heartbeat) to triggers",
								"Feeling as if the traumatic event is happening again",
							],
						},
						{
							title: "Avoidance Symptoms",
							content: [
								"Avoiding thoughts, feelings, or conversations about the trauma",
								"Avoiding places, people, or activities that trigger memories",
								"Inability to remember important aspects of the traumatic event",
								"Diminished interest in significant activities",
								"Feeling detached or estranged from others",
								"Restricted range of emotions or feeling emotionally numb",
							],
						},
						{
							title: "Hyperarousal Symptoms",
							content: [
								"Difficulty falling or staying asleep",
								"Irritability or outbursts of anger",
								"Difficulty concentrating",
								"Hypervigilance (constantly scanning for danger)",
								"Exaggerated startle response",
								"Physical symptoms like headaches or digestive issues",
							],
							tips: [
								"Symptoms must persist for more than one month for PTSD diagnosis",
								"Not everyone who experiences trauma develops PTSD",
								"Seeking help early can prevent symptoms from worsening",
							],
						},
					],
				},
				"how to cope with ptsd": {
					icon: <Heart className="w-5 h-5 text-orange-500" />,
					sections: [
						{
							title: "Immediate Coping Strategies",
							content: [
								"Practice grounding techniques (5-4-3-2-1 sensory method)",
								"Use deep breathing exercises during flashbacks",
								"Create a safe space in your home with comforting items",
								"Develop a daily routine to provide structure and predictability",
								"Practice progressive muscle relaxation",
								"Use positive self-talk and affirmations",
							],
						},
						{
							title: "Managing Triggers",
							content: [
								"Identify and document your specific triggers",
								"Develop coping strategies for each identified trigger",
								"Practice gradual exposure with professional guidance",
								"Use mindfulness to stay present during difficult moments",
								"Create safety plans for high-risk situations",
								"Build a support network of trusted individuals",
							],
						},
						{
							title: "Self-Care Practices",
							content: [
								"Maintain regular sleep schedule and good sleep hygiene",
								"Engage in regular physical exercise",
								"Practice relaxation techniques like yoga or meditation",
								"Limit alcohol and avoid recreational drugs",
								"Eat nutritious meals at regular times",
								"Engage in creative or expressive activities",
							],
							tips: [
								"Healing is not linear - expect ups and downs",
								"Be patient and compassionate with yourself",
								"Small steps forward are still progress",
							],
						},
					],
				},
				"how to overcome ptsd": {
					icon: <Brain className="w-5 h-5 text-green-500" />,
					sections: [
						{
							title: "Evidence-Based Treatments",
							content: [
								"Trauma-Focused Cognitive Behavioral Therapy (TF-CBT)",
								"Eye Movement Desensitization and Reprocessing (EMDR)",
								"Prolonged Exposure Therapy",
								"Cognitive Processing Therapy (CPT)",
								"Medications: SSRIs, SNRIs for symptom management",
								"Group therapy with other trauma survivors",
							],
						},
						{
							title: "Building Resilience",
							content: [
								"Develop strong social support networks",
								"Learn healthy coping mechanisms",
								"Practice stress management techniques",
								"Build self-efficacy through achievable goals",
								"Cultivate meaning and purpose in life",
								"Engage in community or volunteer activities",
							],
						},
						{
							title: "Long-term Recovery",
							content: [
								"Continue therapy even after symptoms improve",
								"Maintain healthy lifestyle habits",
								"Stay connected with support systems",
								"Practice ongoing self-care and stress management",
								"Consider helping others who have experienced trauma",
								"Celebrate progress and milestones in recovery",
							],
							tips: [
								"Recovery is possible with proper treatment and support",
								"Many trauma survivors go on to live fulfilling lives",
								"Post-traumatic growth can occur alongside healing",
							],
						},
					],
				},
			},
			"obsessive compulsive disorder (ocd) course": {
				"symptoms of ocd": {
					icon: <AlertCircle className="w-5 h-5 text-blue-500" />,
					sections: [
						{
							title: "Common Obsessions",
							content: [
								"Fear of contamination or germs",
								"Unwanted aggressive or violent thoughts",
								"Excessive concern with order, symmetry, or exactness",
								"Religious or moral concerns (scrupulosity)",
								"Fear of harming oneself or others",
								"Unwanted sexual thoughts or images",
								"Superstitious fears about numbers, colors, or arrangements",
							],
						},
						{
							title: "Common Compulsions",
							content: [
								"Excessive hand washing or cleaning rituals",
								"Checking behaviors (locks, appliances, etc.)",
								"Counting, repeating, or arranging objects",
								"Mental rituals (prayers, counting, repeating phrases)",
								"Seeking reassurance from others repeatedly",
								"Avoiding situations that trigger obsessions",
								"Hoarding or inability to discard items",
							],
						},
						{
							title: "Impact on Daily Life",
							content: [
								"Rituals take up significant time (more than 1 hour daily)",
								"Interference with work, school, or social activities",
								"Distress when unable to perform compulsions",
								"Recognition that obsessions/compulsions are excessive",
								"Avoidance of situations that trigger symptoms",
							],
							tips: [
								"OCD is a medical condition, not a character flaw",
								"Symptoms can fluctuate in severity over time",
								"Early intervention leads to better outcomes",
							],
						},
					],
				},
				"how to cope with ocd": {
					icon: <Heart className="w-5 h-5 text-teal-500" />,
					sections: [
						{
							title: "Resisting Compulsions",
							content: [
								"Practice delaying compulsions for increasing periods",
								"Use the 'STOP' technique: Stop, Take a breath, Observe, Proceed mindfully",
								"Challenge the need for certainty or perfection",
								"Accept uncertainty as a normal part of life",
								"Practice mindfulness to observe thoughts without acting",
								"Use distraction techniques during urges",
							],
						},
						{
							title: "Managing Obsessive Thoughts",
							content: [
								"Recognize that thoughts are not facts or predictions",
								"Practice thought defusion techniques",
								"Avoid mental arguing with obsessive thoughts",
								"Label thoughts as 'OCD thoughts' rather than personal thoughts",
								"Use humor or absurdity to reduce thought power",
								"Practice acceptance rather than fighting thoughts",
							],
						},
						{
							title: "Daily Management",
							content: [
								"Maintain regular sleep and exercise routines",
								"Practice stress reduction techniques",
								"Build a support network of understanding people",
								"Educate family and friends about OCD",
								"Keep a symptom diary to track patterns",
								"Celebrate small victories in resisting compulsions",
							],
							tips: [
								"Progress may be slow but every small step counts",
								"Setbacks are normal and part of the recovery process",
								"Focus on function and quality of life, not perfect control",
							],
						},
					],
				},
				"how to overcome ocd": {
					icon: <Brain className="w-5 h-5 text-indigo-500" />,
					sections: [
						{
							title: "Professional Treatment",
							content: [
								"Exposure and Response Prevention (ERP) therapy",
								"Cognitive Behavioral Therapy (CBT) for OCD",
								"Acceptance and Commitment Therapy (ACT)",
								"Medications: SSRIs at higher doses than for depression",
								"Intensive outpatient programs for severe cases",
								"Group therapy with other OCD sufferers",
							],
						},
						{
							title: "Building Long-term Recovery",
							content: [
								"Develop a hierarchy of feared situations for gradual exposure",
								"Practice regular exposure exercises to maintain gains",
								"Build tolerance for uncertainty and imperfection",
								"Develop healthy coping strategies for stress",
								"Maintain medication compliance if prescribed",
								"Continue therapy sessions even after improvement",
							],
						},
						{
							title: "Lifestyle and Support",
							content: [
								"Join OCD support groups or online communities",
								"Educate yourself about OCD through reputable sources",
								"Practice regular self-care and stress management",
								"Maintain social connections and activities",
								"Consider family therapy to improve relationships",
								"Advocate for yourself in treatment settings",
							],
							tips: [
								"Recovery is possible with proper treatment",
								"Many people with OCD live normal, fulfilling lives",
								"Treatment works best when you're actively engaged",
							],
						},
					],
				},
			},
			"schizophrenia course": {
				"symptoms of schizophrenia": {
					icon: <AlertCircle className="w-5 h-5 text-purple-500" />,
					sections: [
						{
							title: "Positive Symptoms",
							content: [
								"Hallucinations (hearing, seeing, feeling things that aren't there)",
								"Delusions (false beliefs not based in reality)",
								"Disorganized thinking and speech",
								"Abnormal motor behavior or catatonia",
								"Paranoid thoughts or feelings of persecution",
							],
						},
						{
							title: "Negative Symptoms",
							content: [
								"Reduced emotional expression (flat affect)",
								"Decreased motivation and ability to begin activities",
								"Reduced speaking (alogia)",
								"Diminished ability to experience pleasure",
								"Social withdrawal and isolation",
								"Neglect of personal hygiene and self-care",
							],
						},
						{
							title: "Cognitive Symptoms",
							content: [
								"Difficulty concentrating or paying attention",
								"Problems with working memory",
								"Impaired executive functioning",
								"Difficulty processing information",
								"Problems with decision-making",
							],
							tips: [
								"Early intervention improves long-term outcomes",
								"Symptoms typically emerge in late teens to early thirties",
								"Professional diagnosis is essential for proper treatment",
							],
						},
					],
				},
				"how to cope with schizophrenia": {
					icon: <Heart className="w-5 h-5 text-red-500" />,
					sections: [
						{
							title: "Managing Symptoms",
							content: [
								"Take medications consistently as prescribed",
								"Develop reality testing skills for delusions",
								"Use coping strategies for hallucinations",
								"Maintain structured daily routines",
								"Practice stress reduction techniques",
								"Stay connected with treatment team",
							],
						},
						{
							title: "Daily Living Skills",
							content: [
								"Break tasks into smaller, manageable steps",
								"Use reminders and organizational tools",
								"Maintain personal hygiene and self-care routines",
								"Practice social skills in safe environments",
								"Engage in meaningful activities and hobbies",
								"Build and maintain supportive relationships",
							],
						},
						{
							title: "Crisis Management",
							content: [
								"Recognize early warning signs of relapse",
								"Have a crisis plan with emergency contacts",
								"Know when to seek immediate professional help",
								"Maintain regular contact with healthcare providers",
								"Avoid alcohol and recreational drugs",
								"Manage stress through healthy coping mechanisms",
							],
							tips: [
								"Recovery is a journey, not a destination",
								"Focus on managing symptoms rather than eliminating them",
								"Build a strong support network of family, friends, and professionals",
							],
						},
					],
				},
				"how to overcome schizophrenia": {
					icon: <Brain className="w-5 h-5 text-green-500" />,
					sections: [
						{
							title: "Comprehensive Treatment",
							content: [
								"Antipsychotic medications for symptom management",
								"Cognitive Behavioral Therapy (CBT) for psychosis",
								"Social skills training",
								"Vocational rehabilitation programs",
								"Family therapy and education",
								"Case management services",
							],
						},
						{
							title: "Building Recovery",
							content: [
								"Set realistic, achievable goals",
								"Develop independent living skills",
								"Pursue education or vocational training",
								"Build meaningful relationships and social connections",
								"Engage in community activities and support groups",
								"Practice self-advocacy and empowerment",
							],
						},
						{
							title: "Long-term Management",
							content: [
								"Maintain consistent medication adherence",
								"Continue regular therapy and medical appointments",
								"Develop strong coping strategies for ongoing symptoms",
								"Build a comprehensive support network",
								"Focus on strengths and abilities rather than limitations",
								"Advocate for yourself in healthcare and social settings",
							],
							tips: [
								"Many people with schizophrenia live independent, fulfilling lives",
								"Treatment adherence is crucial for long-term stability",
								"Recovery looks different for everyone - focus on your own journey",
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

			{content.sections.map(
				(section: { title: string; content: string[]; tips?: string[] }) => (
					<div key={section.title} className="space-y-3">
						<h4 className="font-semibold text-foreground">{section.title}</h4>
						<ul className="space-y-2">
							{section.content.map((item) => (
								<li key={item} className="flex items-start gap-2 text-sm">
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
									{section.tips.map((tip) => (
										<li
											key={tip}
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
				),
			)}

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
