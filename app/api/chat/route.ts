import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { messages } = await request.json();

		const systemMessage = {
			role: "system",
			content: `You are a compassionate mental health support assistant for Salutis, a mental health platform. Your role is to:

1. Provide supportive, empathetic responses
2. Offer evidence-based mental health information and coping strategies
3. Encourage users to seek professional help when appropriate
4. Never provide medical diagnoses or replace professional treatment
5. Focus on mental health topics like depression, anxiety, PTSD, bipolar disorder, OCD, schizophrenia, and panic disorders
6. Provide practical coping techniques, breathing exercises, mindfulness practices, and self-care tips
7. Be encouraging and hopeful while acknowledging the user's struggles

IMPORTANT: Respond directly to the user without using any thinking tags, internal reasoning, or meta-commentary. Provide clear, helpful responses immediately.

Always remind users that while you can provide support and information, professional mental health care is important for serious concerns.`,
		};

		const response = await fetch("https://ai.hackclub.com/chat/completions", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				messages: [systemMessage, ...messages],
			}),
		});

		if (!response.ok) {
			throw new Error(`AI API error: ${response.status}`);
		}

		const data = await response.json();

		let cleanedMessage = data.choices[0].message.content;
		cleanedMessage = cleanedMessage
			.replace(/<think>[\s\S]*?<\/think>/gi, "")
			.trim();

		return NextResponse.json({
			message: cleanedMessage,
			success: true,
		});
	} catch (error) {
		console.error("Chat API error:", error);
		return NextResponse.json(
			{
				error: "Failed to get AI response",
				message:
					"I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or explore our mental health courses for immediate support.",
				success: false,
			},
			{ status: 500 },
		);
	}
}
