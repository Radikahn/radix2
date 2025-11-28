"use client";
import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import header from "./components/header";
import footer from "./components/footer";
import ClickSpark from "./components/ClickSpark";
import ScrambledText from "@/components/ScrambledText";
import SoundCloudEmbed from "./components/SoundCloudEmbed";
import { CurseForgeModGizmo } from "./components/CurseForgeModGizmo";

import "@fontsource/jersey-10";
import "@fontsource/jetbrains-mono";

export default function Home() {
    const [showArrow, setShowArrow] = useState(true);

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
                            radixpack minecraft server
                        </ScrambledText>
                    </div>

                    <div className="text-gray-800 font-jersey-10 text-3xl absolute top-60 right-45 z-10 pointer-events-auto">
                        <a
                            href="https://www.instagram.com/radikahn/"
                            target="_blank"
                            className="pointer-events-auto"
                        >
                            {">?"}
                        </a>
                    </div>

                    <div className="absolute top-80 right-320 z-10 pointer-events-auto">
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

                    <div className="absolute top-150 right-100 z-10 pointer-events-auto">
                        <SoundCloudEmbed trackUrl="https://api.soundcloud.com/tracks/2147966751" />
                    </div>

                    {/*Download Minecraft Mods*/}
                    <div className="mt-128 space-y-24">
                        <section className="min-h-screen flex items-center justify-center">
                            <div className="text-center space-y-6">
                                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">
                                    Download Pack
                                </h2>
                                <div>
                                    <Link
                                        className="flex justify-center inline-contents text-gray-600 font-jetbrains-mono text-lg max-w-2xl"
                                        href="https://drive.google.com/drive/folders/1iFQ6Gt4rJr74T32pWM2Aj41T1LJlGFd7?usp=sharing"
                                        target="_blank"
                                    >
                                        <p>Google Drive:</p>

                                        <FaDownload className="mt-1 ml-4"></FaDownload>
                                    </Link>
                                </div>
                            </div>
                        </section>

                        <section className="min-h-screen flow-root justify-center p-4 ">
                            <div className="text-center space-y-6">
                                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">
                                    Mod Suggestions
                                </h2>
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
