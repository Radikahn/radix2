import { useState, useEffect } from "react";
import { IoCopyOutline, IoCheckmark } from "react-icons/io5";
import header from "../components/header";
import footer from "../components/footer";
import ClickSpark from "../components/ClickSpark";
import ScrambledText from "@/components/ScrambledText";
import SoundCloudEmbed from "../components/SoundCloudEmbed";

import "@fontsource/jersey-10";
import "@fontsource/jetbrains-mono";
import AboutMe from "@/components/AboutMe";
import MyLinks from "@/components/MyLinks";

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
              className="text-gray-800 font-jetbrains-mono text-2xl cursor-default"
            >
              Hi my name is Radi
            </ScrambledText>
          </div>

          <div>
            <ScrambledText
              radius={50}
              duration={5}
              speed={0.5}
              scrambleChars={"10"}
              className="absolute top-80 left-100 z-10 text-gray-800 font-jetbrains-mono text-2xl cursor-default"
            >
              welcome to my chunk of the internet
            </ScrambledText>
          </div>

          <div className="text-blue-800 font-jersey-10 text-3xl absolute top-60 right-45 z-10 pointer-events-auto">
            <a
              href="https://www.instagram.com/radikahn/"
              target="_blank"
              rel="noreferrer"
              className="pointer-events-auto"
            >
              {">?"}
            </a>
          </div>

          <SoundCloudEmbed />

          <div className="absolute top-80 left-20 z-10 pointer-events-auto">
            <a
              href="https://www.reddit.com/r/NixOS/comments/173rast/hilarious_and_true_advice_for_anyone_interested/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button"
              target="_blank"
              rel="noreferrer"
            >
              <img src={"/nixOS.jpg"} className="w-60 h-60" />
            </a>
          </div>

          {/*About Me Section*/}
          <div className="mt-150 space-y-24">
            <section className="min-h-screen flex items-center justify-center">
              <AboutMe />
            </section>

            {/*stuff about my links / self promo*/}
            <section className="flex flex-col min-h-screen justify-start items-start">
              <MyLinks />
            </section>
          </div>
        </main>

        <footer className="w-full p-6 flex justify-end">{footer()}</footer>

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
