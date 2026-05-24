import ScrambledText from "@/components/ScrambledText";

export default function Greeting() {
  return (
    <div className="flex flex-col gap-3">
      <ScrambledText
        radius={40}
        duration={5}
        speed={0.5}
        scrambleChars={"10"}
        className="text-gray-800 font-jetbrains-mono text-lg cursor-default"
      >
        Hi my name is Radi
      </ScrambledText>
      <ScrambledText
        radius={40}
        duration={5}
        speed={0.5}
        scrambleChars={"10"}
        className="text-gray-800 font-jetbrains-mono text-lg cursor-default"
      >
        welcome to my chunk of the internet
      </ScrambledText>
      <a
        href="https://www.instagram.com/radikahn/"
        target="_blank"
        rel="noreferrer"
        className="text-blue-800 font-jersey-10 text-2xl"
      >
        {">?"}
      </a>
    </div>
  );
}
