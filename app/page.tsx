'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import header from "./components/header";
import footer from "./components/footer";
import ClickSpark from "./components/ClickSpark";
import ScrambledText from "@/components/ScrambledText";

import "@fontsource/jersey-10"
import "@fontsource/jetbrains-mono"





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

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <ClickSpark
      sparkColor='#000000ff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={3}
      duration={400}
      extraScale={1}
    >

      <div className="flex flex-col min-h-screen dark:bg-white">
        <header className="fixed flex justify-start w-full p-6 z-50">
          <a href="#" >
            {header()}
          </a>
        </header>
        

        <main className="flex-auto p-6 relative">
          <div>
            <ScrambledText
              radius={50}
              duration={5}
              speed={0.5}
              scrambleChars={'10'}
              className="text-gray-800 font-jetbrains-mono text-2xl"
              >

                I like to make things

            </ScrambledText>

          </div>

          <div className="text-gray-800 font-jersey-10 text-3xl absolute top-60 right-45 z-10 pointer-events-auto">
            <a href="https://www.instagram.com/radikahn/" target="_blank" className="pointer-events-auto">
              {'>?'}
            </a>
          </div>



          {/* Additional content sections */}
          {/* <div className="mt-32 space-y-24">
            <section className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-6">
                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">Section 1</h2>
                <p className="text-gray-600 font-jetbrains-mono text-lg max-w-2xl">
                  Placeholder so that I can scroll
                </p>
              </div>
            </section>

            <section className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-6">
                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">Section 2</h2>
                <p className="text-gray-600 font-jetbrains-mono text-lg max-w-2xl">
                  Placeholder so that I can scroll
                </p>
              </div>
            </section>

            <section className="min-h-screen flex items-center justify-center">
              <div className="text-center space-y-6">
                <h2 className="text-gray-800 font-jetbrains-mono text-4xl">Section 3</h2>
                <p className="text-gray-600 font-jetbrains-mono text-lg max-w-2xl">
                  placeholder so I can scroll
                </p>
              </div>
            </section>
          </div> */}
        </main>

        <footer className="w-full p-6 flex justify-end">
          {footer()}
        </footer>

        {/* Bouncing arrow indicator */}
        <div
          className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow pointer-events-none transition-opacity duration-1000 ease-out ${
            showArrow ? 'opacity-100' : 'opacity-0'
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
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </div>

      </div>
    </ClickSpark>
  );
}
