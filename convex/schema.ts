import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
	...authTables,
	courses: defineTable({
		title: v.string(),
		description: v.string(),
		modules: v.array(v.string()),
	}),
	userCourses: defineTable({
		userId: v.id("users"),
		courseId: v.id("courses"),
		startedAt: v.number(),
		completedModules: v.array(v.string()),
		isCompleted: v.boolean(),
	})
		.index("by_user", ["userId"])
		.index("by_user_course", ["userId", "courseId"]),
});
