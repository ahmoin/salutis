import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Check if courses need initialization
export const needsInitialization = query({
	args: {},
	handler: async (ctx) => {
		const courses = await ctx.db.query("courses").collect();
		return courses.length === 0;
	},
});

// Get all available courses
export const getCourses = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("courses").collect();
	},
});

// Get user's enrolled courses (also ensures courses exist)
export const getUserCourses = query({
	args: {},
	handler: async (ctx) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const userCourses = await ctx.db
			.query("userCourses")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect();

		// Get course details for each enrolled course
		const coursesWithDetails = await Promise.all(
			userCourses.map(async (userCourse) => {
				const course = await ctx.db.get(userCourse.courseId);
				return {
					...userCourse,
					course,
				};
			}),
		);

		return coursesWithDetails;
	},
});

// Start a course
export const startCourse = mutation({
	args: {
		courseId: v.id("courses"),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		// Check if user is already enrolled in this course
		const existingEnrollment = await ctx.db
			.query("userCourses")
			.withIndex("by_user_course", (q) =>
				q.eq("userId", userId).eq("courseId", args.courseId),
			)
			.first();

		if (existingEnrollment) {
			throw new Error("Already enrolled in this course");
		}

		// Enroll user in the course
		const userCourseId = await ctx.db.insert("userCourses", {
			userId,
			courseId: args.courseId,
			startedAt: Date.now(),
			completedModules: [],
			isCompleted: false,
		});

		return userCourseId;
	},
});

// Complete a module
export const completeModule = mutation({
	args: {
		userCourseId: v.id("userCourses"),
		moduleName: v.string(),
	},
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx);
		if (!userId) {
			throw new Error("Not authenticated");
		}

		const userCourse = await ctx.db.get(args.userCourseId);
		if (!userCourse || userCourse.userId !== userId) {
			throw new Error("Course not found or access denied");
		}

		// Add module to completed modules if not already completed
		if (!userCourse.completedModules.includes(args.moduleName)) {
			const updatedCompletedModules = [
				...userCourse.completedModules,
				args.moduleName,
			];

			// Get course details to check if all modules are completed
			const course = await ctx.db.get(userCourse.courseId);
			const isCompleted = course
				? updatedCompletedModules.length === course.modules.length
				: false;

			await ctx.db.patch(args.userCourseId, {
				completedModules: updatedCompletedModules,
				isCompleted,
			});
		}
	},
});

// Initialize courses automatically (called internally)
export const ensureCoursesExist = mutation({
	args: {},
	handler: async (ctx) => {
		// Check if courses already exist
		const existingCourses = await ctx.db.query("courses").collect();
		if (existingCourses.length > 0) {
			return {
				message: "Courses already exist",
				count: existingCourses.length,
			};
		}

		const courses = [
			{
				title: "Depression Course",
				description: "Learn to understand and manage depression",
				modules: [
					"Symptoms of Depression",
					"How to cope with Depression",
					"How to overcome Depression",
				],
			},
			{
				title: "Schizophrenia Course",
				description: "Understanding and managing schizophrenia",
				modules: [
					"Symptoms of Schizophrenia",
					"How to cope with Schizophrenia",
					"How to overcome Schizophrenia",
				],
			},
			{
				title: "Obsessive Compulsive Disorder (OCD) Course",
				description: "Managing OCD symptoms and behaviors",
				modules: [
					"Symptoms of OCD",
					"How to cope with OCD",
					"How to overcome OCD",
				],
			},
			{
				title: "Post-traumatic Stress Disorder (PTSD) Course",
				description: "Healing from trauma and managing PTSD",
				modules: [
					"Symptoms of PTSD",
					"How to cope with PTSD",
					"How to overcome PTSD",
				],
			},
			{
				title: "Bipolar Disorder Course",
				description: "Understanding mood swings and stability",
				modules: [
					"Symptoms of Bipolar Disorder",
					"How to cope with Bipolar Disorder",
					"How to overcome Bipolar Disorder",
				],
			},
			{
				title: "Panic Disorder Course",
				description: "Managing panic attacks and anxiety",
				modules: [
					"Symptoms of Panic Disorder",
					"How to cope with Panic Disorder",
					"How to overcome Panic Disorder",
				],
			},
		];

		// Insert all courses
		const courseIds = await Promise.all(
			courses.map((course) => ctx.db.insert("courses", course)),
		);

		return {
			message: "Courses initialized successfully",
			courseIds,
			count: courseIds.length,
		};
	},
});
