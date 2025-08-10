import type { Metadata } from "next";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { cn } from "@/lib/utils";
import { fontVariables } from "@/lib/fonts";

import "@/styles/globals.css";
import { META_THEME_COLORS } from "@/lib/config";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
	title: "Salutis",
	description: "A work in progress.",
	icons: {
		icon: "/salutis.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ConvexAuthNextjsServerProvider>
			<html lang="en" suppressHydrationWarning>
				<head>
					<script
						// biome-ignore lint/security/noDangerouslySetInnerHtml: needed for theme initialization
						dangerouslySetInnerHTML={{
							__html: `
              try {
                if (localStorage.theme === 'dark' || ((!('theme' in localStorage) || localStorage.theme === 'system') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.querySelector('meta[name="theme-color"]').setAttribute('content', '${META_THEME_COLORS.dark}')
                }
                if (localStorage.layout) {
                  document.documentElement.classList.add('layout-' + localStorage.layout)
                }
              } catch (_) {}
            `,
						}}
					/>
					<meta name="theme-color" content={META_THEME_COLORS.light} />
				</head>
				<body
					className={cn(
						"text-foreground group/body overscroll-none font-sans antialiased [--footer-height:calc(var(--spacing)*14)] [--header-height:calc(var(--spacing)*14)] xl:[--footer-height:calc(var(--spacing)*24)] theme-violet bg-background",
						fontVariables,
					)}
				>
					<ConvexClientProvider>
						<ThemeProvider>
						<section className="theme-container">{children}</section>
							<Toaster position="top-center" richColors />
						</ThemeProvider>
					</ConvexClientProvider>
				</body>
			</html>
		</ConvexAuthNextjsServerProvider>
	);
}
