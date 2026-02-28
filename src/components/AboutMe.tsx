import { IoDocument } from "react-icons/io5";

export default function AboutMe() {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-gray-800 font-jetbrains-mono text-4xl">About Me</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex flex-col">
          <div className="font-jetbrains-mono justify-center cursor-default">
            <p>Hi! I like to make things (software, photography, and music) </p>
            <div className="flex flex-row justify-center">
              <p className="mt-2">If you are a recruiter look here {"->"}</p>
              <a
                href="https://www.linkedin.com/in/radman-shahbazkhan-3799302b2/"
                target="_blank"
              >
                <IoDocument className="ml-4 mt-2 text-2xl cursor-pointer "></IoDocument>
              </a>
            </div>

            <p className="mt-8">Here to explore? Keep scrolling :3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
