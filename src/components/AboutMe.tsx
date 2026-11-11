import { ALL } from "dns";
import { IoDocument } from "react-icons/io5";
import { Tooltip } from "./toolTip/Tooltip";

export default function AboutMe() {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-gray-800 font-jetbrains-mono text-4xl">About Me</h2>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex flex-col">
          <div className="font-jetbrains-mono justify-center cursor-default">
            <p>Hi! I like to make things (software, photography, and music) </p>
            <div className="flex flex-row justify-center mb-8">
              <p className="mt-2">If you are a recruiter look here {"->"}</p>
              <a
                href="https://www.linkedin.com/in/radman-shahbazkhan-3799302b2/"
                target="_blank"
              >
                <Tooltip text="View my LinkedIn">
                  <IoDocument className="ml-4 mt-2 text-2xl cursor-pointer"></IoDocument>
                </Tooltip>
              </a>
            </div>

            <span>
              Here is {' '}
              <Tooltip text="cool things I coded live here">
                <a
                  className="text-blue-700 underline cursor-pointer hover:text-purple-900 duration-500"
                  href="https://github.com/Radikahn"
                  target="_blank"
                >
                  my Github
                </a>
              </Tooltip>
            </span>

            <p className="mt-8">
              Also I have a {` `}
              <Tooltip text="a running collection of my thoughts and interests">
                <a
                  className="text-blue-700 underline cursor-pointer hover:text-purple-900 duration-500"
                  href="https://blog.radikahn.com"
                  target="_blank">
                  blog!
                </a>
              </Tooltip>
            </p>


            <p className="mt-8">Here to explore? Keep scrolling :3</p>
            <p className="mt-4">Below exists stuff I've made and my links!</p>


          </div>
        </div>
      </div>
    </div>
  );
}
