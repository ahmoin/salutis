"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Copy, ThumbsUp, ThumbsDown, Edit } from "lucide-react";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import type { JSX } from "react/jsx-runtime";

function MarkdownRenderer({ content }: { content: string }) {
	const parseMarkdown = (text: string) => {
		const lines = text.split("\n");
		const elements: JSX.Element[] = [];
		let currentList: string[] = [];
		let listType: "ul" | "ol" | null = null;

		const flushList = () => {
			if (currentList.length > 0 && listType) {
				const ListComponent = listType === "ul" ? "ul" : "ol";
				elements.push(
					<ListComponent
						key={elements.length}
						className={`list-${listType === "ul" ? "disc" : "decimal"} list-outside ml-4 space-y-1`}
					>
						{currentList.map((item, idx) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: needed for rendering lists
							<li key={idx} className="py-1">
								<span
									// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for parsing markdown
									dangerouslySetInnerHTML={{
										__html: parseInlineMarkdown(item),
									}}
								/>
							</li>
						))}
					</ListComponent>,
				);
				currentList = [];
				listType = null;
			}
		};

		lines.forEach((line) => {
			const trimmedLine = line.trim();

			if (!trimmedLine) {
				flushList();
				return;
			}

			if (trimmedLine.startsWith("### ")) {
				flushList();
				elements.push(
					<h3 key={elements.length} className="font-semibold text-lg mt-4 mb-2">
						{trimmedLine.slice(4)}
					</h3>,
				);
			} else if (trimmedLine.startsWith("## ")) {
				flushList();
				elements.push(
					<h2 key={elements.length} className="font-semibold text-xl mt-4 mb-2">
						{trimmedLine.slice(3)}
					</h2>,
				);
			} else if (trimmedLine.startsWith("# ")) {
				flushList();
				elements.push(
					<h1 key={elements.length} className="font-bold text-2xl mt-4 mb-2">
						{trimmedLine.slice(2)}
					</h1>,
				);
			} else if (trimmedLine === "---") {
				flushList();
				elements.push(
					<hr key={elements.length} className="my-4 border-border" />,
				);
			} else if (/^\d+\.\s/.test(trimmedLine)) {
				if (listType !== "ol") {
					flushList();
					listType = "ol";
				}
				currentList.push(trimmedLine.replace(/^\d+\.\s/, ""));
			} else if (trimmedLine.startsWith("- ")) {
				if (listType !== "ul") {
					flushList();
					listType = "ul";
				}
				currentList.push(trimmedLine.slice(2));
			} else {
				flushList();
				elements.push(
					<p key={elements.length} className="mb-2">
						<span
							// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for parsing markdown
							dangerouslySetInnerHTML={{
								__html: parseInlineMarkdown(trimmedLine),
							}}
						/>
					</p>,
				);
			}
		});

		flushList();

		return elements;
	};

	const parseInlineMarkdown = (text: string) => {
		return text
			.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
			.replace(/\*(.*?)\*/g, "<em>$1</em>")
			.replace(
				/`(.*?)`/g,
				'<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>',
			);
	};

	return <div className="space-y-2">{parseMarkdown(content)}</div>;
}

export default function Chat() {
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [messages, setMessages] = useState<
		Array<{
			id: number;
			type: "user" | "assistant";
			content: string;
			timestamp: Date;
		}>
	>([
		{
			id: 1,
			type: "assistant" as const,
			content:
				"Hello! I'm your mental health support assistant. How can I help you today?",
			timestamp: new Date(),
		},
	]);

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!message.trim() || isLoading) return;

		const userMessage = {
			id: Date.now(),
			type: "user" as const,
			content: message,
			timestamp: new Date(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setMessage("");
		setIsLoading(true);

		try {
			const apiMessages = [...messages, userMessage].map((msg) => ({
				role: msg.type === "user" ? "user" : "assistant",
				content: msg.content,
			}));

			const response = await fetch("/api/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					messages: apiMessages,
				}),
			});

			const data = await response.json();

			const assistantResponse = {
				id: Date.now() + 1,
				type: "assistant" as const,
				content:
					data.message ||
					"I'm sorry, I couldn't process your request right now.",
				timestamp: new Date(),
			};

			setMessages((prev) => [...prev, assistantResponse]);
		} catch (error) {
			console.error("Chat error:", error);
			const errorResponse = {
				id: Date.now() + 1,
				type: "assistant" as const,
				content:
					"I'm sorry, I'm having trouble connecting right now. Please try again in a moment, or explore our mental health courses for immediate support.",
				timestamp: new Date(),
			};
			setMessages((prev) => [...prev, errorResponse]);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<SiteHeader currentPage="chat" />

			<main className="flex-1 flex flex-col max-h-[calc(100vh-80px)]">
				<div className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4 relative">
					{messages.map((msg) => (
						<div
							key={msg.id}
							data-testid={`message-${msg.type}`}
							className="w-full mx-auto max-w-3xl px-4 group/message"
							data-role={msg.type}
						>
							<div className="flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl group-data-[role=user]/message:w-fit">
								{msg.type === "assistant" && (
									<div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
										<div className="translate-y-px">
											<svg
												height="14"
												strokeLinejoin="round"
												viewBox="0 0 16 16"
												width="14"
												style={{ color: "currentcolor" }}
											>
												<title>Assistant</title>
												<path
													d="M2.5 0.5V0H3.5V0.5C3.5 1.60457 4.39543 2.5 5.5 2.5H6V3V3.5H5.5C4.39543 3.5 3.5 4.39543 3.5 5.5V6H3H2.5V5.5C2.5 4.39543 1.60457 3.5 0.5 3.5H0V3V2.5H0.5C1.60457 2.5 2.5 1.60457 2.5 0.5Z"
													fill="currentColor"
												></path>
												<path
													d="M14.5 4.5V5H13.5V4.5C13.5 3.94772 13.0523 3.5 12.5 3.5H12V3V2.5H12.5C13.0523 2.5 13.5 2.05228 13.5 1.5V1H14H14.5V1.5C14.5 2.05228 14.9477 2.5 15.5 2.5H16V3V3.5H15.5C14.9477 3.5 14.5 3.94772 14.5 4.5Z"
													fill="currentColor"
												></path>
												<path
													d="M8.40706 4.92939L8.5 4H9.5L9.59294 4.92939C9.82973 7.29734 11.7027 9.17027 14.0706 9.40706L15 9.5V10.5L14.0706 10.5929C11.7027 10.8297 9.82973 12.7027 9.59294 15.0706L9.5 16H8.5L8.40706 15.0706C8.17027 12.7027 6.29734 10.8297 3.92939 10.5929L3 10.5V9.5L3.92939 9.40706C6.29734 9.17027 8.17027 7.29734 8.40706 4.92939Z"
													fill="currentColor"
												></path>
											</svg>
										</div>
									</div>
								)}

								<div className="flex flex-col gap-4 w-full">
									<div className="flex flex-row gap-2 items-start">
										{msg.type === "user" && (
											<Button
												variant="ghost"
												size="sm"
												className="py-2 px-2 h-fit rounded-full text-muted-foreground opacity-0 group-hover/message:opacity-100"
											>
												<Edit className="w-4 h-4" />
											</Button>
										)}

										<div
											data-testid="message-content"
											className={`flex flex-col gap-4 ${
												msg.type === "user"
													? "bg-primary text-primary-foreground px-3 py-2 rounded-xl"
													: ""
											}`}
										>
											{msg.type === "user" ? (
												<p>{msg.content}</p>
											) : (
												<MarkdownRenderer content={msg.content} />
											)}
										</div>
									</div>

									{msg.type === "assistant" && (
										<div className="flex flex-row gap-2">
											<Button
												variant="outline"
												size="sm"
												className="py-1 px-2 h-fit text-muted-foreground"
											>
												<Copy className="w-4 h-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="py-1 px-2 h-fit text-muted-foreground"
											>
												<ThumbsUp className="w-4 h-4" />
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="py-1 px-2 h-fit text-muted-foreground"
											>
												<ThumbsDown className="w-4 h-4" />
											</Button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
					<div className="shrink-0 min-w-[24px] min-h-[24px]"></div>
				</div>

				{/* Message Input */}
				<div className="border-t border-border p-6">
					<div className="max-w-4xl mx-auto">
						<form onSubmit={handleSendMessage} className="flex gap-3">
							<Input
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								placeholder={
									isLoading ? "AI is thinking..." : "Type your message here..."
								}
								className="flex-1"
								disabled={isLoading}
							/>
							<Button type="submit" disabled={!message.trim() || isLoading}>
								{isLoading ? (
									<div className="w-4 h-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
								) : (
									<Send className="w-4 h-4" />
								)}
							</Button>
						</form>
						<p className="text-xs text-muted-foreground mt-2 text-center">
							AI-powered mental health support. For comprehensive learning,
							explore our courses.
						</p>
					</div>
				</div>
			</main>
		</>
	);
}
