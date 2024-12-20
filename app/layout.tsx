import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "CONCEALMINT",
	description: "Create and share NFTs with private files",
	icons: {
		apple: "/apple-touch-icon.png",
		shortcut: "/favicon.ico",
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "CONCEALMINT",
		description: "Create and share NFTs with private files",
		url: "https://concealmint.com",
		siteName: "CONCEALMINT",
		images: ["https://www.concealmint.com/og.png"],
	},
	twitter: {
		card: "summary_large_image",
		title: "CONCEALMINT",
		description: "Create and share NFTs with private files",
		images: ["https://www.concealmint.com/og.png"],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased`}
			>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						{children}
						<Analytics />
						<Toaster />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
