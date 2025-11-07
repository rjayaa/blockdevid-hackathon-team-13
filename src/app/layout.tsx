import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import PannaProviderComponent from "@/components/providers/panna-provider";
import Navbar from "@/components/ui/Navbar";
import GlobeWrapper from "@/components/ui/GlobeWrapper";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "BlockDevID - Web3 Integration",
    description: "Web3 wallet integration with Panna SDK",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="no-scrollbar">
            <body
                className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
            >
                <PannaProviderComponent>
                    <div className="relative font-space">
                        <GlobeWrapper />
                        <Navbar />
                        {children}
                    </div>
                </PannaProviderComponent>
            </body>
        </html>
    );
}
