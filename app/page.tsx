"use client";
import { useState, useEffect } from "react";
import {
    IoDocumentTextSharp,
    IoCopyOutline,
    IoCheckmark,
} from "react-icons/io5";
import Image from "next/image";
import Link from "next/link";
import header from "./components/header";
import footer from "./components/footer";
import ClickSpark from "./components/ClickSpark";
import ScrambledText from "@/components/ScrambledText";
import SoundCloudEmbed from "./components/SoundCloudEmbed";

import "@fontsource/jersey-10";
import "@fontsource/jetbrains-mono";

export default function Home() {
    const [showArrow, setShowArrow] = useState(true);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText("wheat.radikahn.com");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy text: ", err);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            // Hide arrow if user has scrolled more than 100px from top
            if (window.scrollY > 100) {
                setShowArrow(false);
            } else {
                setShowArrow(true);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <ClickSpark
            sparkColor="#000000ff"
            sparkSize={10}
            sparkRadius={15}
            sparkCount={3}
            duration={400}
            extraScale={1}
        >
            <div className="flex flex-col min-h-screen dark:bg-white">
                <header className="fixed flex justify-start w-full p-6 z-50">
                    <a href="#">{header()}</a>
                </header>

                <main className="flex-auto p-6 relative">
                    <div>
                        <ScrambledText
                            radius={50}
                            duration={5}
                            speed={0.5}
                            scrambleChars={"10"}
                            className="text-gray-800 font-jetbrains-mono text-2xl"
                        >
                            radix2 minecraft server
                        </ScrambledText>
                    </div>

                    <div className="text-blue-800 font-jersey-10 text-3xl absolute top-60 right-45 z-10 pointer-events-auto">
                        <a
                            href="https://www.instagram.com/radikahn/"
                            target="_blank"
                            className="pointer-events-auto"
                        >
                            {">?"}
                        </a>
                    </div>

                    <SoundCloudEmbed />

                    <div className="absolute top-80 left-20 z-10 pointer-events-auto">
                        <Link
                            href="https://www.reddit.com/r/NixOS/comments/173rast/hilarious_and_true_advice_for_anyone_interested/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
                            target="_blank"
                        >
                            <img
                                src={"/china_cat.jpg"}
                                className="w-50, h-50"
                            ></img>
                        </Link>
                    </div>

                    {/*Rules for base system*/}
                    <div className="mt-128 space-y-24">
                        <section className="min-h-screen flex items-center justify-center">
                            <div className="text-center space-y-6">
                                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">
                                    Rules
                                </h2>
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <div>
                                        <Link
                                            className="flex justify-center inline-contents text-gray-600 font-jetbrains-mono text-lg max-w-2xl"
                                            href="https://docs.google.com/document/d/1mymts2M5YdEX61BXmfy6mznRR7oYfEbylo9jOxrrwf4/edit?usp=sharing"
                                            target="_blank"
                                        >
                                            <p>Full Rule Set:</p>

                                            <IoDocumentTextSharp className="mt-1 ml-4 h-6 w-6" />
                                        </Link>
                                    </div>
                                    <ul className="text-gray-800 font-jetbrains-mono text-lg text-left list-disc list-inside space-y-2">
                                        <li>Wheat is the central currency </li>
                                        <li>
                                            The world starts as a 800x800
                                            bordered map
                                        </li>
                                        <li>Bartering is the way to play!</li>
                                        <li>
                                            Rule enforcements are split between
                                            restricted server access and player
                                            moderation
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section className="min-h-screen flow-root justify-center p-4 ">
                            <div className="text-center space-y-6">
                                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">
                                    Join or Request Access:
                                </h2>
                                <div className="flex justify-center">
                                    <div className="relative group">
                                        <div className="flex items-center gap-3 px-6 py-4 bg-gray-100 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                                            <code className="text-gray-800 font-jetbrains-mono text-2xl select-all">
                                                wheat.radikahn.com
                                            </code>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                                                aria-label="Copy to clipboard"
                                            >
                                                {copied ? (
                                                    <IoCheckmark className="w-5 h-5" />
                                                ) : (
                                                    <IoCopyOutline className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start mt-8">
                                <div className="flex justify-center mt-8 border"></div>
                            </div>
                        </section>
                    </div>
                </main>

                <footer className="w-full p-6 flex justify-end">
                    {footer()}
                </footer>

                {/* Bouncing arrow indicator */}
                <div
                    className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow pointer-events-none transition-opacity duration-1000 ease-out ${
                        showArrow ? "opacity-100" : "opacity-0"
                    }`}
                >
                    <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-800"
                    >
                        <path d="M12 5v14M19 12l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </ClickSpark>
    );
}
