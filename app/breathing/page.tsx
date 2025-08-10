"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

type BreathingPhase = "inhale" | "hold" | "exhale" | "pause";

interface BreathingPattern {
	name: string;
	description: string;
	pattern: [number, number, number, number];
	color: string;
}

const breathingPatterns: BreathingPattern[] = [
	{
		name: "4-7-8 Relaxation",
		description: "Calming technique for stress relief and better sleep",
		pattern: [4, 7, 8, 0],
		color: "bg-blue-500",
	},
	{
		name: "Box Breathing",
		description: "Equal timing for focus and concentration",
		pattern: [4, 4, 4, 4],
		color: "bg-green-500",
	},
	{
		name: "Triangle Breathing",
		description: "Simple pattern for beginners",
		pattern: [4, 0, 4, 4],
		color: "bg-purple-500",
	},
	{
		name: "Energizing Breath",
		description: "Quick pattern to boost energy and alertness",
		pattern: [3, 1, 3, 1],
		color: "bg-orange-500",
	},
];

export default function BreathingExercises() {
	const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(
		breathingPatterns[0],
	);
	const [isActive, setIsActive] = useState(false);
	const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
	const [timeLeft, setTimeLeft] = useState(selectedPattern.pattern[0]);
	const [cycleCount, setCycleCount] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const phaseLabels = {
		inhale: "Breathe In",
		hold: "Hold",
		exhale: "Breathe Out",
		pause: "Pause",
	};

	const getNextPhase = (phase: BreathingPhase): BreathingPhase => {
		const phases: BreathingPhase[] = ["inhale", "hold", "exhale", "pause"];
		const currentIndex = phases.indexOf(phase);
		return phases[(currentIndex + 1) % phases.length];
	};

	const getPhaseTime = (phase: BreathingPhase): number => {
		const [inhale, hold, exhale, pause] = selectedPattern.pattern;
		switch (phase) {
			case "inhale":
				return inhale;
			case "hold":
				return hold;
			case "exhale":
				return exhale;
			case "pause":
				return pause;
		}
	};

	const resetExercise = () => {
		setIsActive(false);
		setCurrentPhase("inhale");
		setTimeLeft(selectedPattern.pattern[0]);
		setCycleCount(0);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const toggleExercise = () => {
		if (isActive) {
			setIsActive(false);
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		} else {
			setIsActive(true);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: getNextPhase changes on every re-render and should not be used as a hook dependency.
	useEffect(() => {
		if (isActive) {
			intervalRef.current = setInterval(() => {
				setTimeLeft((prev) => {
					if (prev <= 1) {
						const nextPhase = getNextPhase(currentPhase);
						const nextTime = getPhaseTime(nextPhase);

						if (nextPhase === "inhale") {
							setCycleCount((count) => count + 1);
						}

						setCurrentPhase(nextPhase);
						return nextTime;
					}
					return prev - 1;
				});
			}, 1000);
		} else {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isActive, currentPhase, selectedPattern]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resetExercise changes on every re-render and should not be used as a hook dependency.
	useEffect(() => {
		resetExercise();
	}, [selectedPattern]);

	const getCircleScale = () => {
		const progress = 1 - timeLeft / getPhaseTime(currentPhase);
		if (currentPhase === "inhale") {
			return 0.5 + progress * 0.5;
		}
		if (currentPhase === "exhale") {
			return 1 - progress * 0.5;
		}
		return currentPhase === "hold" ? 1 : 0.5;
	};

	return (
		<>
			<SiteHeader currentPage="breathing" />
			<main className="p-8 flex flex-col gap-8 max-w-6xl mx-auto">
				<div className="text-center">
					<h1 className="text-4xl font-bold mb-2">Breathing Exercises</h1>
					<p className="text-muted-foreground text-lg">
						Guided breathing patterns for relaxation and focus
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="space-y-4">
						<h2 className="text-2xl font-semibold">Choose a Pattern</h2>
						{breathingPatterns.map((pattern) => (
							<Card
								key={pattern.name}
								className={`cursor-pointer transition-all ${
									selectedPattern.name === pattern.name
										? "ring-2 ring-primary"
										: "hover:shadow-md"
								}`}
								onClick={() => setSelectedPattern(pattern)}
							>
								<CardHeader className="pb-2">
									<div className="flex items-center gap-3">
										<div className={`w-4 h-4 rounded-full ${pattern.color}`} />
										<CardTitle className="text-lg">{pattern.name}</CardTitle>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground mb-2">
										{pattern.description}
									</p>
									<div className="text-xs text-muted-foreground">
										Pattern: {pattern.pattern.join("-")} seconds
									</div>
								</CardContent>
							</Card>
						))}
					</div>

					<div className="lg:col-span-2 flex flex-col items-center justify-center space-y-8">
						<div className="relative flex items-center justify-center">
							<div
								className={`w-64 h-64 rounded-full ${selectedPattern.color} opacity-20 transition-transform duration-1000 ease-in-out`}
								style={{
									transform: `scale(${getCircleScale()})`,
								}}
							/>
							<div className="absolute inset-0 flex flex-col items-center justify-center text-center">
								<div className="text-3xl font-bold mb-2">
									{phaseLabels[currentPhase]}
								</div>
								<div className="text-6xl font-mono font-bold">{timeLeft}</div>
								<div className="text-sm text-muted-foreground mt-2">
									Cycle {cycleCount}
								</div>
							</div>
						</div>

						<div className="flex gap-4">
							<Button
								onClick={toggleExercise}
								size="lg"
								className="flex items-center gap-2"
							>
								{isActive ? (
									<>
										<Pause className="w-5 h-5" />
										Pause
									</>
								) : (
									<>
										<Play className="w-5 h-5" />
										Start
									</>
								)}
							</Button>
							<Button
								onClick={resetExercise}
								variant="outline"
								size="lg"
								className="flex items-center gap-2"
							>
								<RotateCcw className="w-5 h-5" />
								Reset
							</Button>
						</div>

						<Card className="w-full max-w-md">
							<CardHeader>
								<CardTitle className="text-lg">Instructions</CardTitle>
							</CardHeader>
							<CardContent className="space-y-2">
								<p className="text-sm">
									• Find a comfortable position and relax your shoulders
								</p>
								<p className="text-sm">
									• Follow the circle&apos;s expansion and contraction
								</p>
								<p className="text-sm">
									• Breathe through your nose when possible
								</p>
								<p className="text-sm">
									• Focus on the rhythm and let your mind settle
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</main>
		</>
	);
}
