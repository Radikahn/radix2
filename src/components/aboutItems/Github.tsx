import LinkPreview from "../LinkPreview";

export default function Github() {
  return (
    <LinkPreview
      className=""
      label="my Github"
      href="https://github.com/Radikahn"
      previewLabel="Github.com/Radikahn"
      previewImage={
        <a
          className="w-full h-full object-cover"
          href="https://github.com/Radikahn"
          target="_blank"
        >
          <img src="./git.png" className="w-full h-full object-cover" />
        </a>
      }
      dots={[{ color: "text-gray-500" }]}
    />
  );
}
