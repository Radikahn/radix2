import LinkPreview from "../LinkPreview";

export default function Saec() {
  return (
    <LinkPreview
      className=""
      label="Car Club Site"
      href="https://we-saec.me/dash"
      previewLabel="we-saec.me/dash"
      previewImage={
        <a
          className="w-full h-full object-cover"
          href="https://we-saec.me/dash"
          target="_blank"
        >
          <img className="w-full h-full object-cover" src="/saec.png" />
        </a>
      }
      dots={[{ color: "text-navy-500" }]}
    />
  );
}
